from config.pinecone import pc
from pinecone import ServerlessSpec

index_name = "pdf-qa"

if not pc.has_index(index_name):
    pc.create_index(
        name=index_name,
        vector_type="dense",
        dimension=1024,
        metric="cosine",
        spec=ServerlessSpec(
            cloud="aws",
            region="us-east-1"
        ),
        deletion_protection="disabled"
    )

print("Index ready:", index_name)