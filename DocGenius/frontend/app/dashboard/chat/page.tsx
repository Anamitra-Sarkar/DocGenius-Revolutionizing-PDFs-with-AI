"use client"

import type React from "react"
import { Suspense } from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, FileText, ChevronRight, Sparkles, Copy, Check, MessageSquare, Search, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { mockDocuments, mockMessages, sendMessage, type Document, type Message, type Citation } from "@/lib/api"
import { cn } from "@/lib/utils"

function ChatPageContent() {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSelectDocument = (doc: Document) => {
    setSelectedDocument(doc)
    setMessages(mockMessages)
  }

  const handleSendMessage = async () => {
    if (!input.trim() || !selectedDocument || isLoading) return

    const userMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await sendMessage(selectedDocument.id, userMessage.content)
      setMessages((prev) => [...prev, response])
    } catch {
      // Handle error
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] -m-4 lg:-m-6">
      {/* Document sidebar */}
      <AnimatePresence initial={false}>
        {isSidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-r border-border bg-muted/30 flex flex-col overflow-hidden"
          >
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold mb-3">Select Document</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  className="w-full pl-9 pr-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {mockDocuments
                  .filter((doc) => doc.status === "indexed")
                  .map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => handleSelectDocument(doc)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
                        selectedDocument?.id === doc.id
                          ? "bg-primary/10 border border-primary/20"
                          : "hover:bg-muted border border-transparent",
                      )}
                    >
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.pageCount} pages</p>
                      </div>
                    </button>
                  ))}
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle sidebar button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-6 h-12 rounded-l-none border border-l-0 border-border bg-background hover:bg-muted"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <ChevronRight className={cn("w-4 h-4 transition-transform", isSidebarOpen && "rotate-180")} />
      </Button>

      {/* Chat area */}
      <div className="flex-1 flex flex-col relative">
        {!selectedDocument ? (
          <EmptyState />
        ) : (
          <>
            {/* Chat header */}
            <div className="px-4 py-3 border-b border-border bg-background flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{selectedDocument.name}</p>
                <p className="text-xs text-muted-foreground">{selectedDocument.pageCount} pages indexed</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setMessages([])}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="max-w-3xl mx-auto space-y-6">
                {messages.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-medium mb-2">Start a conversation</h3>
                    <p className="text-sm text-muted-foreground">Ask any question about "{selectedDocument.name}"</p>
                  </div>
                )}
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isLoading && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input area */}
            <div className="p-4 border-t border-border bg-background">
              <div className="max-w-3xl mx-auto">
                <div className="relative">
                  <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={`Ask a question about ${selectedDocument.name}...`}
                    className="min-h-[52px] max-h-[200px] pr-12 resize-none bg-secondary/50"
                    rows={1}
                  />
                  <Button
                    size="icon"
                    className="absolute right-2 bottom-2 w-8 h-8"
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isLoading}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Press Enter to send, Shift+Enter for new line
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Chat with your documents</h2>
        <p className="text-muted-foreground mb-6">
          Select a document from the sidebar to start asking questions and getting AI-powered answers with citations.
        </p>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Ask questions in natural language</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <FileText className="w-4 h-4 text-primary" />
            <span>Get answers with source citations</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <Plus className="w-4 h-4 text-primary" />
            <span>Upload more documents anytime</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ChatMessage({ message }: { message: Message }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isUser = message.role === "user"

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex gap-4", isUser && "flex-row-reverse")}
    >
      <Avatar className="w-8 h-8 flex-shrink-0">
        {isUser ? (
          <>
            <AvatarImage src="/professional-avatar.png" />
            <AvatarFallback>JD</AvatarFallback>
          </>
        ) : (
          <>
            <AvatarFallback className="bg-primary text-primary-foreground">
              <Sparkles className="w-4 h-4" />
            </AvatarFallback>
          </>
        )}
      </Avatar>

      <div className={cn("flex-1 space-y-2", isUser && "text-right")}>
        <div
          className={cn(
            "inline-block rounded-2xl px-4 py-2.5 max-w-[85%] text-left",
            isUser ? "bg-primary text-primary-foreground" : "bg-muted",
          )}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* Citations */}
        {message.citations && message.citations.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {message.citations.map((citation, idx) => (
              <CitationBadge key={idx} citation={citation} />
            ))}
          </div>
        )}

        {/* Actions */}
        {!isUser && (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={handleCopy}>
              {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function CitationBadge({ citation }: { citation: Citation }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-xs">
      <FileText className="w-3 h-3 text-primary" />
      <span className="font-medium">{citation.documentName}</span>
      <span className="text-muted-foreground">p.{citation.pageNumber}</span>
    </div>
  )
}

function TypingIndicator() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4">
      <Avatar className="w-8 h-8">
        <AvatarFallback className="bg-primary text-primary-foreground">
          <Sparkles className="w-4 h-4" />
        </AvatarFallback>
      </Avatar>
      <div className="bg-muted rounded-2xl px-4 py-3">
        <div className="flex gap-1">
          <motion.div
            className="w-2 h-2 bg-muted-foreground/50 rounded-full"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
          />
          <motion.div
            className="w-2 h-2 bg-muted-foreground/50 rounded-full"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
          />
          <motion.div
            className="w-2 h-2 bg-muted-foreground/50 rounded-full"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
          />
        </div>
      </div>
    </motion.div>
  )
}

export default function ChatPage() {
  return (
    <Suspense fallback={null}>
      <ChatPageContent />
    </Suspense>
  )
}
