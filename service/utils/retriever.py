from config.pinecone import pc

index = pc.Index("pdf-qa")


def search_similar_chunks(
    query_embedding: list[float],
    document_id: str,
    top_k: int = 3,
) -> list:

    result = index.query(
        vector=query_embedding,
        top_k=top_k,
        filter={
            "document_id": {
                "$eq": document_id
            }
        },
        include_metadata=True,
    )

    return result.matches