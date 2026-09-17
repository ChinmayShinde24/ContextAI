from utils.rag import ask_question

document_id = "0ba6c304-8600-4971-b7f1-5bcae01e0501"

question = "What technologies candidate knows?"

answer = ask_question(
    question,
    document_id,
)

print("Answer:", answer)