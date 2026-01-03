import React, { useState } from 'react'

export default function Gemini() {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function generate() {
    setLoading(true)
    setResponse(null)
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL
      const res = await fetch(`${base}/gemini/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Generation failed')
      setResponse(data.response)
    } catch (err: any) {
      setResponse(err.message || 'Error')
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
      {response && <pre style={{ marginTop: 12, background: '#fff', padding: 12 }}>{response}</pre>}
    </section>
  )
}
