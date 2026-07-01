import os
import sys
import logging
from pathlib import Path
from typing import List, Optional
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

from contextlib import asynccontextmanager

# Add current directory to path to ensure local module imports work
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import config
from utils.logger import get_logger
from utils.pdf_loader import PDFLoader
from utils.text_chunker import TextChunker
from utils.embeddings import EmbeddingManager
from utils.vector_store import VectorStoreManager
from utils.retriever import Retriever
from utils.llm import LLMManager

logger = get_logger("api")

# Global variables for RAG components
embed_manager: Optional[EmbeddingManager] = None
vs_manager: Optional[VectorStoreManager] = None
retriever: Optional[Retriever] = None
llm_manager: Optional[LLMManager] = None
active_index_name: Optional[str] = None
active_pdf_name: Optional[str] = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan handler. Attempts to auto-initialize the system with 'employee_handbook.pdf'
    if it is present in the data folder on startup.
    """
    default_pdf = config.DATA_DIR / "employee_handbook.pdf"
    if default_pdf.exists():
        try:
            initialize_rag(default_pdf)
        except Exception as e:
            logger.warning(f"Could not auto-initialize with default PDF on startup: {str(e)}")
    else:
        logger.info("No default employee_handbook.pdf found in data directory on startup. System is uninitialized.")
    yield

app = FastAPI(
    title="Lightweight Document QA API",
    description="REST API for Lightweight RAG Pipeline over PDF Documents",
    version="1.0.0",
    lifespan=lifespan
)

# Allow requests from the React dev server and any localhost origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    question: str
    top_k: Optional[int] = 3

class ChunkResponse(BaseModel):
    chunk_id: Optional[int]
    page_number: Optional[int]
    score: float
    content: str

class QueryResponse(BaseModel):
    answer: str
    retrieved_chunks: List[ChunkResponse]

def initialize_rag(pdf_path: Path):
    """
    Initializes/loads embeddings, splits document into chunks, creates FAISS vector index, 
    and instantiates retriever and LLM managers.
    """
    global embed_manager, vs_manager, retriever, llm_manager, active_index_name, active_pdf_name
    
    try:
        logger.info(f"Initializing RAG pipeline for document: {pdf_path}")
        
        # 1. Load PDF
        loader = PDFLoader(str(pdf_path))
        documents = loader.load()
        
        index_name = pdf_path.stem + "_index"
        
        # 2. Initialize Embeddings
        embed_manager = EmbeddingManager()
        embeddings = embed_manager.get_embeddings()
        
        # 3. Create or Load Vector Store Index
        vs_manager = VectorStoreManager(embeddings, index_name)
        if vs_manager.index_exists():
            logger.info(f"Existing FAISS index '{index_name}' found. Loading from disk...")
            vector_store = vs_manager.load_or_create_index([])
        else:
            logger.info(f"Building new FAISS index '{index_name}'...")
            chunker = TextChunker()
            chunks = chunker.split_documents(documents)
            vector_store = vs_manager.load_or_create_index(chunks)
            
        # 4. Initialize Retriever and LLM Manager
        retriever = Retriever(vector_store, top_k=3)
        llm_manager = LLMManager()
        
        active_index_name = index_name
        active_pdf_name = pdf_path.name
        logger.info("RAG pipeline initialization completed successfully.")
        
    except Exception as e:
        logger.error(f"Failed to initialize RAG pipeline: {str(e)}", exc_info=True)
        raise e


@app.get("/status")
async def get_status():
    """
    Returns the initialization status and details of the active PDF/index.
    """
    return {
        "status": "ready" if retriever is not None else "uninitialized",
        "active_pdf": active_pdf_name,
        "active_index": active_index_name,
        "default_pdf_exists": (config.DATA_DIR / "employee_handbook.pdf").exists()
    }

@app.post("/ask", response_model=QueryResponse)
async def ask_question(request: QueryRequest):
    """
    Query the active index using a question. Uses LLM to formulate an answer
    strict to the retrieved context chunks.
    """
    global retriever, llm_manager
    
    if not retriever or not llm_manager:
        raise HTTPException(
            status_code=400,
            detail="RAG pipeline is uninitialized. Please upload a PDF first."
        )
        
    if not request.question.strip():
        raise HTTPException(
            status_code=400,
            detail="Question query cannot be empty."
        )
        
    try:
        # Override top_k default if requested
        if request.top_k is not None and request.top_k > 0:
            retriever.top_k = request.top_k
            
        # Retrieve context chunks
        results = retriever.get_relevant_chunks(request.question)
        
        context_texts = []
        retrieved_chunks = []
        
        for doc, score in results:
            context_texts.append(doc.page_content)
            retrieved_chunks.append(ChunkResponse(
                chunk_id=doc.metadata.get("chunk_id"),
                page_number=doc.metadata.get("page_number"),
                score=float(score),
                content=doc.page_content
            ))
            
        # Generate Answer with LLM
        answer = llm_manager.generate_answer(context_texts, request.question)
        
        return QueryResponse(
            answer=answer,
            retrieved_chunks=retrieved_chunks
        )
        
    except Exception as e:
        logger.error(f"Error during query processing: {str(e)}", exc_info=True)
        # Protect internal structure, only return safe message
        raise HTTPException(
            status_code=500,
            detail="An error occurred while generating the answer. Please check server logs."
        )

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    """
    Upload a new PDF document. Sanitizes path names to prevent path traversal 
    and initializes/rebuilds the index for the uploaded file.
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Unsupported file format: Only PDF files are supported."
        )
        
    try:
        # Security: sanitize filename to avoid directory traversal
        safe_filename = Path(file.filename).name
        file_path = config.DATA_DIR / safe_filename
        
        # Save file to disk
        logger.info(f"Saving uploaded file to {file_path}")
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
            
        # Initialize RAG pipeline with uploaded document
        initialize_rag(file_path)
        
        return {
            "message": f"Successfully uploaded '{safe_filename}' and initialized RAG pipeline.",
            "active_pdf": active_pdf_name,
            "active_index": active_index_name
        }
        
    except Exception as e:
        logger.error(f"Failed to process uploaded PDF: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Failed to process uploaded PDF file. Please check server logs."
        )

if __name__ == "__main__":
    logger.info("Starting REST API Server...")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
