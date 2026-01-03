import React, { useState } from 'react'
import PdfUpload from '../components/PdfUpload'
import PdfChat from '../components/PdfChat'
import GeminiBox from '../components/GeminiBox'

export default function Page() {
  const [documentId, setDocumentId] = useState<string | null>(null)
  return (
    <main>
      <h1 style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial' }}>DocGenius</h1>
      <p style={{ color: '#555' }}>Ask questions about your PDFs</p>
      <PdfUpload onUploaded={(id: string) => setDocumentId(id)} />
      <div style={{ marginTop: 24 }}>
        <PdfChat documentId={documentId} />
      </div>
      <div style={{ marginTop: 40 }}>
        <GeminiBox />
      </div>
    </main>
  )
}
