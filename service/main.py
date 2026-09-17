from fastapi import FastAPI
from datetime import datetime
from routes.document import router as document_router
from routes.chat import router as chat_router

app = FastAPI()

app.include_router(document_router, prefix="/documents")
app.include_router(chat_router, prefix="/chat")

@app.get("/health")
def health_check():
    return {"status": "ok",
            "message": "Server is healthy",
            "timestamp": datetime.now().isoformat()
            }