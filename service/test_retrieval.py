from utils.embedder import create_embeddings
from utils.retriever import search_similar_chunks

# query = "What is the grand total?"
query = "What is the client name?"

query_embedding = create_embeddings([query])[0]

matches = search_similar_chunks(query_embedding)

for i, match in enumerate(matches, start=1):
    print(f"\n--- Match {i} ---")
    print("Score:", match["score"])
    print("Page:", match["metadata"]["page"])
    print("Text:", match["metadata"]["text"])