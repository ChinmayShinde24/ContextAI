from utils.embedder import create_embeddings
from utils.retriever import search_similar_chunks
from utils.llm import build_rag_prompt, generate_answer


def ask_question(
    question: str,
    document_id: str,
) -> str:
    query_embedding = create_embeddings([question])[0]

    matches = search_similar_chunks(
        query_embedding,
        document_id,
    )

    prompt = build_rag_prompt(
        question,
        matches,
    )

    answer = generate_answer(prompt)

    return answer