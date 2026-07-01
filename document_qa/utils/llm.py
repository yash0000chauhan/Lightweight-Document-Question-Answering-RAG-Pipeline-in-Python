import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.runnables import RunnableSequence
from langchain_core.output_parsers import StrOutputParser
from .prompt import get_qa_prompt
from .logger import get_logger

logger = get_logger(__name__)

class LLMManager:
    """
    Handles initialization of Gemini 2.5 Flash and answering logic.
    """
    def __init__(self):
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key or api_key == "your_api_key_here":
            logger.error("Invalid API Key: GOOGLE_API_KEY is not set correctly.")
            raise ValueError("Invalid API key: Please set GOOGLE_API_KEY in the .env file.")
            
        try:
            # Initialize Gemini 2.5 Flash
            self.llm = ChatGoogleGenerativeAI(
                model="gemini-2.5-flash",
                google_api_key=api_key,
                temperature=0.0 # Keep temperature 0 to minimize hallucinations
            )
            self.prompt = get_qa_prompt()
            self.chain = self.prompt | self.llm | StrOutputParser()
            logger.info("LLM Initialized successfully.")
        except Exception as e:
            logger.error(f"LLM Failure: {str(e)}")
            raise Exception(f"LLM Failure: Could not initialize Gemini LLM. {str(e)}")

    def generate_answer(self, context_chunks: list[str], question: str) -> str:
        """
        Passes retrieved chunks and user question to the LLM.
        """
        if not question.strip():
            logger.error("Empty Question provided.")
            raise ValueError("Empty Question: Please ask a valid question.")

        context_str = "\n\n".join(context_chunks)
        
        try:
            logger.info("Generating LLM Response...")
            response = self.chain.invoke({
                "context": context_str,
                "question": question
            })
            logger.info("LLM Response Generated.")
            return response.strip()
        except Exception as e:
            logger.error(f"LLM Invocation Failure: {str(e)}")
            raise Exception(f"LLM Failure: Failed to generate an answer. {str(e)}")
