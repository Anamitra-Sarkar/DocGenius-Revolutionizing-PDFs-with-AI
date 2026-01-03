import React, { useState } from 'react'
import { apiFetch, ApiError } from '../lib/apiClient'

export default function GeminiBox() {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function generate() {
    if (!prompt.trim()) return
    
    setLoading(true)
    setResponse(null)
    setError(null)
    
    try {
      const data = await apiFetch('/gemini/generate', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
      })
      setResponse(data.response)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Failed to generate text. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <h2 style={{ marginTop: 0, marginBottom: 12, fontSize: 18 }}>Gemini Text Generation</h2>
      <textarea 
        value={prompt} 
        onChange={(e) => setPrompt(e.target.value)} 
        rows={4} 
        placeholder="Enter your prompt for Gemini AI..."
        disabled={loading}
        style={{ 
          width: '100%', 
          padding: '8px 12px',
          fontSize: 14,
          border: '1px solid #d1d5db',
          borderRadius: 4,
          fontFamily: 'inherit',
          resize: 'vertical'
        }} 
      />
      <div style={{ marginTop: 8 }}>
        <button 
          onClick={generate} 
          disabled={loading || !prompt.trim()}
          style={{
            padding: '8px 16px',
            fontSize: 14,
            fontWeight: 500,
            backgroundColor: loading || !prompt.trim() ? '#9ca3af' : '#0066cc',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: loading || !prompt.trim() ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Generating...' : 'Generate'}
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
      
      {response && (
        <div style={{ 
          marginTop: 12, 
          backgroundColor: '#f9fafb', 
          padding: 16, 
          borderRadius: 6,
          border: '1px solid #e5e7eb',
          fontSize: 14,
          lineHeight: 1.6,
          whiteSpace: 'pre-wrap'
        }}>
          <div style={{ fontWeight: 600, marginBottom: 8, color: '#374151' }}>Response:</div>
          {response}
        </div>
      )}
    </section>
  )
}
