// Centralized API client for DocGenius

export interface Document {
  id: string
  name: string
  size: number
  uploadedAt: Date
  status: "processing" | "indexed" | "error"
  pageCount?: number
}

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  citations?: Citation[]
  timestamp: Date
}

export interface Citation {
  documentId: string
  documentName: string
  pageNumber: number
  snippet: string
}

export interface GenerationTemplate {
  id: string
  name: string
  description: string
  prompt: string
  icon: string
}

// Hardcoded backend URL for deployment
const API_URL = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
  ? "http://localhost:8000" 
  : "https://docgenius-revolutionizing-pdfs-with-ai.onrender.com")

// Mock data for initial UI state
export const mockDocuments: Document[] = [
  {
    id: "1",
    name: "Getting Started Guide.pdf",
    size: 245760,
    uploadedAt: new Date("2024-01-15"),
    status: "indexed",
    pageCount: 12,
  },
  {
    id: "2",
    name: "API Documentation.pdf",
    size: 512000,
    uploadedAt: new Date("2024-01-14"),
    status: "indexed",
    pageCount: 24,
  },
  {
    id: "3",
    name: "User Manual.pdf",
    size: 1024000,
    uploadedAt: new Date("2024-01-13"),
    status: "indexed",
    pageCount: 48,
  },
]

export const mockMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hello! I've analyzed your document. Feel free to ask me anything about it.",
    timestamp: new Date(),
  },
]

export const generationTemplates: GenerationTemplate[] = [
  {
    id: "1",
    name: "Summarize",
    description: "Create a concise summary of the document",
    prompt: "Please summarize the following content in a clear and concise manner:",
    icon: "FileText",
  },
  {
    id: "2",
    name: "Rewrite",
    description: "Rewrite content in a different style",
    prompt: "Please rewrite the following content to improve clarity and flow:",
    icon: "RefreshCw",
  },
  {
    id: "3",
    name: "Explain Simply",
    description: "Explain like I'm 5 years old",
    prompt: "Please explain the following content in simple terms that anyone can understand:",
    icon: "Lightbulb",
  },
  {
    id: "4",
    name: "Generate Notes",
    description: "Create structured study notes",
    prompt: "Please create structured study notes from the following content:",
    icon: "BookOpen",
  },
]

// API functions

export async function fetchDocuments(): Promise<Document[]> {
  try {
    const res = await fetch(`${API_URL}/pdf/documents`)
    if (!res.ok) throw new Error("Failed to fetch documents")
    const data = await res.json()
    // Map backend data to frontend interface
    return data.map((d: any) => ({
      id: d.id,
      name: d.name,
      size: d.size,
      uploadedAt: new Date(d.uploadedAt),
      status: d.status,
      pageCount: d.pageCount,
    }))
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function uploadDocument(file: File): Promise<Document> {
  const formData = new FormData()
  formData.append("file", file)

  const res = await fetch(`${API_URL}/pdf/upload`, {
    method: "POST",
    body: formData,
  })

  if (!res.ok) {
    throw new Error("Failed to upload document")
  }

  const data = await res.json()

  // Return a synthetic document object immediately since backend accepts it.
  // In a real app we might fetch the doc details again or rely on the response.
  return {
    id: data.document_id,
    name: file.name,
    size: file.size,
    uploadedAt: new Date(),
    status: "indexed", // Assume indexed if success for now
    pageCount: data.page_count || 0,
  }
}

export async function sendMessage(documentId: string, message: string): Promise<Message> {
  const res = await fetch(`${API_URL}/pdf/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ document_id: documentId, question: message }),
  })

  if (!res.ok) {
    throw new Error("Failed to send message")
  }

  const data = await res.json()

  return {
    id: Math.random().toString(36).substr(2, 9), // ID generated on client for now
    role: "assistant",
    content: data.answer,
    citations: [], // Backend doesn't support citations yet
    timestamp: new Date(),
  }
}

export async function generateText(prompt: string, template: string): Promise<string> {
  // We prepend the template instruction to the prompt context if needed, 
  // but here the 'prompt' arg is usually the user content to process 
  // and 'template' is the name or ID. 
  // Let's find the template prompt prefix.
  const tmpl = generationTemplates.find(t => t.name === template || t.id === template)
  const fullPrompt = tmpl ? `${tmpl.prompt}\n\n${prompt}` : prompt

  const res = await fetch(`${API_URL}/gemini/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: fullPrompt }),
  })

  if (!res.ok) {
    throw new Error("Failed to generate text")
  }

  const data = await res.json()
  return data.response
}
