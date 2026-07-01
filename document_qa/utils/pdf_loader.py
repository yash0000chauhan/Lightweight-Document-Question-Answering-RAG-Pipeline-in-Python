import os
from pathlib import Path
from PyPDF2 import PdfReader
from PyPDF2.errors import PdfReadError
from langchain_core.documents import Document
from .logger import get_logger

logger = get_logger(__name__)

class PDFLoaderError(Exception):
    """Custom exception for PDF loading errors."""
    pass

class PDFLoader:
    """
    Handles loading and extracting text from PDF files.
    """
    def __init__(self, file_path: str):
        self.file_path = file_path

    def load(self) -> list[Document]:
        """
        Extracts text from the PDF.
        Ignores blank pages and handles corrupted PDFs gracefully.
        
        Returns:
            List of langchain Documents.
        """
        if not os.path.exists(self.file_path):
            logger.error(f"File not found: {self.file_path}")
            raise FileNotFoundError(f"Missing PDF: The file '{self.file_path}' does not exist.")
            
        if not self.file_path.lower().endswith('.pdf'):
            logger.error(f"Unsupported file format: {self.file_path}")
            raise ValueError("Unsupported file: Only PDF files are supported.")

        documents = []
        try:
            reader = PdfReader(self.file_path)
            
            if len(reader.pages) == 0:
                logger.error(f"Empty PDF: {self.file_path}")
                raise ValueError("Empty PDF: The provided PDF has no pages.")

            for i, page in enumerate(reader.pages):
                text = page.extract_text()
                if text and text.strip():
                    # Valid non-blank page
                    metadata = {
                        "source": Path(self.file_path).name,
                        "page_number": i + 1
                    }
                    documents.append(Document(page_content=text, metadata=metadata))
            
            if not documents:
                logger.warning(f"No extractable text found in {self.file_path}")
                raise ValueError("Empty PDF: No readable text found in the document.")
                
            logger.info(f"PDF Loaded successfully: {len(documents)} valid pages extracted from {Path(self.file_path).name}.")
            return documents
            
        except PdfReadError as e:
            logger.error(f"Corrupted PDF: {str(e)}")
            raise PDFLoaderError(f"Corrupted PDF: Unable to read '{self.file_path}'.")
        except Exception as e:
            logger.error(f"Error loading PDF: {str(e)}")
            raise PDFLoaderError(f"Error loading PDF: {str(e)}")
