def chunk_pages(
    pages: list[dict],
    chunk_size: int = 500,
    overlap: int = 50
) -> list[dict]:

    if overlap >= chunk_size:
        raise ValueError("overlap must be smaller than chunk_size")

    chunks = []

    for page in pages:
        text = page["text"]
        words = text.split()

        start = 0

        while start < len(words):
            end = start + chunk_size

            chunk_words = words[start:end]

            chunk_text = " ".join(chunk_words)

            chunks.append({
                "page": page["page"],
                "text": chunk_text
            })

            start = end - overlap

    return chunks