import React, { useState } from 'react'
import { apiFetch } from '../lib/apiClient'

export default function GeminiBox() {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function generate() {
    setLoading(true)
    setResponse(null)
    setError(null)
    try {
      const data = await apiFetch('/gemini/generate', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
      })
      setResponse(data.response)
    } catch (err: any) {
      setError(err.message || 'Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <h2>Gemini Text Generation</h2>
      <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={4} style={{ width: '100%' }} />
      <div style={{ marginTop: 8 }}>
        <button onClick={generate} disabled={loading || !prompt}>
          Generate
        </button>
      </div>
      {loading && <div>Generating...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {response && <pre style={{ marginTop: 12, background: '#fff', padding: 12 }}>{response}</pre>}
    </section>
  )
}
