from config.mistral import client

text = "The grand total is ₹1,10,500."

response = client.embeddings.create(
    model="mistral-embed",
    inputs=[text]
)

embedding = response.data[0].embedding

print("Embedding length:", len(embedding))
print("First 5 values:", embedding[:5])