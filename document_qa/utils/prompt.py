from langchain_core.prompts import PromptTemplate

# Strict prompt template following requirements
QA_PROMPT_TEMPLATE = """
You are a document question answering assistant.
Answer ONLY using the provided context.
Never use outside knowledge.
Never hallucinate.
If the answer cannot be found in the retrieved context, respond exactly:
Information not found in the document.

Context:
{context}

Question:
{question}

Answer:
"""

def get_qa_prompt() -> PromptTemplate:
    """Returns the QA PromptTemplate."""
    return PromptTemplate(
        template=QA_PROMPT_TEMPLATE,
        input_variables=["context", "question"]
    )
