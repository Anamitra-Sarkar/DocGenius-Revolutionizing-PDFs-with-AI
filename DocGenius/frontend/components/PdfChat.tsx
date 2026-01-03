import React, { useState } from 'react'
import { apiFetch, ApiError } from '../lib/apiClient'

export default function PdfChat({ documentId }: { documentId: string | null }) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function ask() {
    if (!documentId || !question.trim()) return
    
    setLoading(true)
    setAnswer(null)
    setError(null)
    
    try {
      const data = await apiFetch('/pdf/ask', {
        method: 'POST',
        body: JSON.stringify({ document_id: documentId, question }),
      })
      setAnswer(data.answer)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Failed to get answer. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      ask()
    }
  }

  return (
    <section>
      <h2 style={{ marginTop: 0, marginBottom: 12, fontSize: 18 }}>Ask Questions</h2>
      {!documentId ? (
        <p style={{ color: '#6b7280', fontStyle: 'italic' }}>
          Upload a PDF document first to start asking questions.
        </p>
      ) : (
        <>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <input
              style={{ 
                flex: 1, 
                padding: '8px 12px', 
                fontSize: 14,
                border: '1px solid #d1d5db',
                borderRadius: 4
              }}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question about the document..."
              disabled={loading}
            />
            <button 
              onClick={ask} 
              disabled={!question.trim() || loading} 
              style={{ 
                padding: '8px 16px',
                fontSize: 14,
                fontWeight: 500,
                backgroundColor: loading ? '#9ca3af' : '#0066cc',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: loading || !question.trim() ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Thinking...' : 'Ask'}
            </button>
          </div>
          
          {error && (
            <div style={{ 
              marginTop: 12, 
              padding: 12, 
              backgroundColor: '#fee2e2', 
              color: '#dc2626',
              borderRadius: 4,
              fontSize: 14
            }}>
              {error}
            </div>
          )}
          
          {answer && (
            <div style={{ 
              marginTop: 12, 
              backgroundColor: '#f9fafb', 
              padding: 16, 
              borderRadius: 6,
              border: '1px solid #e5e7eb',
              lineHeight: 1.6,
              fontSize: 14
            }}>
              <div style={{ fontWeight: 600, marginBottom: 8, color: '#374151' }}>Answer:</div>
              {answer}
            </div>
          )}
        </>
      )}
    </section>
  )
}
