import os
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from ..services.pdf_loader import extract_text_and_chunk
from ..services.vector_store import create_vector_store

router = APIRouter()


@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    """Upload and process a PDF document"""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    try:
        document_id = str(uuid.uuid4())
        save_dir = os.path.join(os.getcwd(), "data")
        os.makedirs(save_dir, exist_ok=True)
        file_path = os.path.join(save_dir, f"{document_id}.pdf")
        
        # Get file size
        file.file.seek(0, 2)
        file_size = file.file.tell()
        file.file.seek(0)
        
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)

        # Get page count
        try:
            from PyPDF2 import PdfReader
            reader = PdfReader(file_path)
            page_count = len(reader.pages)
        except Exception:
            page_count = 0

        texts = extract_text_and_chunk(file_path)
        if not texts:
            # If no text extracted, we still save metadata but maybe mark status??
            # For now, just proceed, maybe it's image based (we don't handle OCR yet)
            # raise HTTPException(status_code=400, detail="Could not extract text from PDF")
            pass
        
        if texts:
            create_vector_store(document_id, texts)

        # Save metadata
        from ..services.metadata_store import save_document_metadata
        save_document_metadata(document_id, file.filename, file_size, page_count)

        return {"document_id": document_id, "status": "success", "page_count": page_count}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process PDF: {str(e)}")


@router.get("/documents")
def list_documents():
    """List all uploaded documents"""
    from ..services.metadata_store import get_all_documents
    return get_all_documents()



class AskRequest(BaseModel):
    document_id: str
    question: str


@router.post("/ask")
def ask_question(req: AskRequest):
    """Ask a question about an uploaded document"""
    if not req.document_id or not req.question:
        raise HTTPException(status_code=400, detail="document_id and question are required")
    
    try:
        from ..services.llm import answer_question

        answer = answer_question(req.document_id, req.question)
        return {"answer": answer, "document_id": req.document_id}
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Document not found")
    except EnvironmentError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to answer question: {str(e)}")
