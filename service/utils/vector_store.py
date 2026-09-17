from config.pinecone import pc

index = pc.Index("pdf-qa")


def upsert_embeddings(
    embeddings: list[list[float]],
    chunks: list[dict],
    document_id: str,
) -> None:

    records = []

    for i, (embedding, chunk) in enumerate(zip(embeddings, chunks)):
        records.append({
            "id": f"{document_id}-chunk-{i}",
            "values": embedding,
            "metadata": {
                "document_id": document_id,
                "page": chunk["page"],
                "text": chunk["text"],
            },
        })

    index.upsert(vectors=records)