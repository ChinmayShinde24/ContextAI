from utils.pdf_extractor import extract_text_from_pdf
from utils.chunker import chunk_pages
from utils.embedder import create_embeddings
from utils.vector_store import upsert_embeddings

pdf_path = "test.pdf"

pages = extract_text_from_pdf(pdf_path)
chunks = chunk_pages(pages)
texts = [chunk["text"] for chunk in chunks]
embeddings = create_embeddings(texts)
upsert_embeddings(embeddings, chunks)

print("Number of embeddings:", len(embeddings))
print("Embedding dimension:", len(embeddings[0]))

for i, chunk in enumerate(chunks, start=1):
    print(f"\n--- Chunk {i} ---")
    print(f"Page: {chunk['page']}")
    print(chunk["text"])