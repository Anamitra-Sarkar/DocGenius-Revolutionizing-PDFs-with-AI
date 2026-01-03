import React, { useState } from 'react'

type Props = { documentId: string | null }

export default function Chat({ documentId }: Props) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function ask() {
    if (!documentId) return
    setLoading(true)
    setAnswer(null)
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL
      const res = await fetch(`${base}/pdf/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ document_id: documentId, question }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Ask failed')
      setAnswer(data.answer)
    } catch (err: any) {
      setAnswer(err.message || 'Error')
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
      {answer && (
        <div style={{ marginTop: 12, background: '#fff', padding: 12, borderRadius: 4 }}>{answer}</div>
      )}
    </section>
  )
}
