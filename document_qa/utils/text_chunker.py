from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from .logger import get_logger
import sys
import os

# Add parent directory to path to import config
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import config

logger = get_logger(__name__)

class TextChunker:
    """
    Handles splitting text into smaller chunks for embeddings.
    """
    def __init__(self, chunk_size: int = config.CHUNK_SIZE, chunk_overlap: int = config.CHUNK_OVERLAP):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        # Uses standard separators prioritizing paragraphs and sentences
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=self.chunk_size,
            chunk_overlap=self.chunk_overlap,
            separators=["\n\n", "\n", ".", " ", ""],
            length_function=len
        )

    def split_documents(self, documents: list[Document]) -> list[Document]:
        """
        Splits a list of Documents into chunked Documents.
        
        Args:
            documents: List of Documents extracted from PDF.
            
        Returns:
            List of chunked Documents with updated metadata.
        """
        if not documents:
            logger.warning("No documents provided for chunking.")
            return []

        chunks = self.text_splitter.split_documents(documents)
        
        # Add chunk id to metadata
        for i, chunk in enumerate(chunks):
            chunk.metadata['chunk_id'] = i + 1

        logger.info(f"Chunks Created: Splitted text into {len(chunks)} chunks.")
        return chunks
