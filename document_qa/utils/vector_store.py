import os
from pathlib import Path
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from langchain_core.embeddings import Embeddings
from .logger import get_logger
import sys

# Add parent directory to path to import config
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import config

logger = get_logger(__name__)

class VectorStoreManager:
    """
    Manages the FAISS vector database creation, saving, and loading.
    """
    def __init__(self, embeddings: Embeddings, index_name: str):
        self.embeddings = embeddings
        self.index_name = index_name
        self.index_path = config.VECTORSTORE_DIR / self.index_name

    def load_or_create_index(self, documents: list[Document]) -> FAISS:
        """
        Loads the FAISS index if it exists. Otherwise, builds a new one from chunks.
        """
        try:
            if self.index_exists():
                logger.info(f"Existing FAISS index found for '{self.index_name}'. Loading from disk...")
                vector_store = FAISS.load_local(
                    folder_path=str(self.index_path),
                    embeddings=self.embeddings,
                    allow_dangerous_deserialization=True # Required for loading local FAISS in new versions
                )
                logger.info("FAISS Index loaded successfully.")
                return vector_store
            else:
                logger.info("No existing index found. Creating Embeddings and Building FAISS Index...")
                vector_store = FAISS.from_documents(documents, self.embeddings)
                
                # Save the index locally
                vector_store.save_local(folder_path=str(self.index_path))
                logger.info("FAISS Index Created and persisted successfully.")
                return vector_store
        except Exception as e:
            logger.error(f"Vector Store Failure: {str(e)}")
            raise Exception(f"Vector Store Failure: {str(e)}")

    def index_exists(self) -> bool:
        """
        Checks if the index directory and required files exist.
        """
        if not self.index_path.exists():
            return False
        if not (self.index_path / "index.faiss").exists():
            return False
        return True
