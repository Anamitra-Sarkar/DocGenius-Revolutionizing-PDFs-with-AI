from typing import List
from PyPDF2 import PdfReader


def extract_text_and_chunk(path: str, chunk_size: int = 1000, overlap: int = 200) -> List[str]:
    reader = PdfReader(path)
    full_text = []
    for page in reader.pages:
        text = page.extract_text() or ""
        full_text.append(text)
    text = "\n".join(full_text)

    # simple chunking by characters with overlap
    chunks = []
    start = 0
    length = len(text)
    while start < length:
        end = min(start + chunk_size, length)
        chunk = text[start:end]
        chunks.append(chunk)
        if end == length:
            break
        start = end - overlap

    return chunks
