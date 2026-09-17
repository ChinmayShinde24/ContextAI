import tempfile

from fastapi import APIRouter, UploadFile, File, Form

from utils.pdf_extractor import extract_text_from_pdf
from utils.chunker import chunk_pages
from utils.embedder import create_embeddings
from utils.vector_store import upsert_embeddings

router = APIRouter()


@router.post("/process")
async def process_document(
    file: UploadFile = File(...),
    document_id: str = Form(...),
):
    pdf_bytes = await file.read()

    with tempfile.NamedTemporaryFile(
        suffix=".pdf",
        delete=False
    ) as temp_file:
        temp_file.write(pdf_bytes)
        temp_path = temp_file.name

    pages = extract_text_from_pdf(temp_path)

    chunks = chunk_pages(pages)

    texts = [chunk["text"] for chunk in chunks]

    embeddings = create_embeddings(texts)

    upsert_embeddings(
        embeddings,
        chunks,
        document_id,
    )

    return {
        "message": "PDF processed successfully",
        "document_id": document_id,
        "file_name": file.filename,
        "page_count": len(pages),
        "chunk_count": len(chunks),
    }