from fastapi import APIRouter

from schemas.chat import ChatRequest
from utils.rag import ask_question

router = APIRouter()


@router.post("/")
def chat(request: ChatRequest):
    answer = ask_question(
        question=request.question,
        document_id=request.document_id,
    )

    return {
        "answer": answer,
    }