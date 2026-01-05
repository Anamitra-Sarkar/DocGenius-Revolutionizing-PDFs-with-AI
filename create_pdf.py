from reportlab.pdfgen import canvas

def create_dummy_pdf(filename):
    c = canvas.Canvas(filename)
    c.drawString(100, 750, "DocGenius Test Document")
    c.drawString(100, 730, "This is a sample PDF created for testing purposes.")
    c.drawString(100, 710, "It contains some simple text to verify the indexing and chat capabilities.")
    c.drawString(100, 690, "DocGenius should be able to answer questions about this content.")
    c.drawString(100, 670, "Secrets: The code word is 'Blueberry'.")
    c.save()

if __name__ == "__main__":
    create_dummy_pdf("test_doc.pdf")
