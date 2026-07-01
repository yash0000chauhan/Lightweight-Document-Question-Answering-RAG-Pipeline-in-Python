from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from .logger import get_logger

logger = get_logger(__name__)

class Retriever:
    """
    Handles similarity search and retrieval of top-k chunks.
    """
    def __init__(self, vector_store: FAISS, top_k: int = 3):
        self.vector_store = vector_store
        self.top_k = top_k
        logger.info("Retriever Initialized.")

    def get_relevant_chunks(self, query: str) -> list[tuple[Document, float]]:
        """
        Retrieves the top-k most relevant chunks for a given query along with their scores.
        Note: FAISS similarity_search_with_score returns L2 distance. Lower score = more similar.
        
        Args:
            query: User's question.
            
        Returns:
            List of tuples containing (Document, Score).
        """
        try:
            # fetch top_k results with scores
            results = self.vector_store.similarity_search_with_score(query, k=self.top_k)
            return results
        except Exception as e:
            logger.error(f"Retrieval Error: {str(e)}")
            raise Exception(f"Retrieval Error: Failed to fetch relevant chunks. {str(e)}")
