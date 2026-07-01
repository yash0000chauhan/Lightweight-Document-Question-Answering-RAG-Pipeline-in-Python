from langchain_google_genai import GoogleGenerativeAIEmbeddings
from .logger import get_logger
import os

logger = get_logger(__name__)

class EmbeddingManager:
    """
    Handles the initialization of the Google Embedding model.
    """
    def __init__(self):
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key or api_key == "your_api_key_here":
            logger.error("Invalid API Key: GOOGLE_API_KEY is not set correctly.")
            raise ValueError("Invalid API key: Please set GOOGLE_API_KEY in the .env file.")
            
        try:
            self.embeddings = GoogleGenerativeAIEmbeddings(
                model="models/gemini-embedding-001",
                google_api_key=api_key
            )
            logger.info("Embeddings Manager initialized successfully.")
        except Exception as e:
            logger.error(f"Embedding Failure: {str(e)}")
            raise Exception(f"Embedding Failure: Could not initialize Google Embeddings. {str(e)}")

    def get_embeddings(self) -> GoogleGenerativeAIEmbeddings:
        """
        Returns the embedding model instance.
        """
        return self.embeddings
