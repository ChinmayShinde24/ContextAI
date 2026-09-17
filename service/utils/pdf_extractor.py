import pymupdf

def extract_text_from_pdf(pdf_path: str) -> list[dict]:
    pages = []

    with pymupdf.open(pdf_path) as doc:
        for page_number, page in enumerate(doc, start=1):
            text = page.get_text()

            pages.append({
                "page": page_number,
                "text": text
            })

    return pages