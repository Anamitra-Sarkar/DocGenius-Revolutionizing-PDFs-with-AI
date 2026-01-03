import React, { useState } from 'react'
import { apiFetch } from '../lib/apiClient'

export default function PdfChat({ documentId }: { documentId: string | null }) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function ask() {
    if (!documentId) return
    setLoading(true)
    setAnswer(null)
    setError(null)
    try {
      const data = await apiFetch('/pdf/ask', {
        method: 'POST',
        body: JSON.stringify({ document_id: documentId, question }),
      })
      setAnswer(data.answer)
    } catch (err: any) {
      setError(err.message || 'Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <h2 style={{ marginTop: 8 }}>Document Q&A</h2>
      <div>
        <input
          style={{ width: '80%' }}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={documentId ? 'Ask a question about the document' : 'Upload a PDF first'}
          disabled={!documentId}
        />
        <button onClick={ask} disabled={!documentId || loading} style={{ marginLeft: 8 }}>
          Ask
        </button>
      </div>
      {loading && <div>Thinking...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {answer && (
        <div style={{ marginTop: 12, background: '#fff', padding: 12, borderRadius: 4 }}>{answer}</div>
      )}
    </section>
  )
}
