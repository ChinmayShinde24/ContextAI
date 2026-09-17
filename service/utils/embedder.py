from config.mistral import client


def create_embeddings(texts: list[str]) -> list[list[float]]:
    response = client.embeddings.create(
        model="mistral-embed",
        inputs=texts
    )

    embeddings = [item.embedding for item in response.data]

    return embeddings