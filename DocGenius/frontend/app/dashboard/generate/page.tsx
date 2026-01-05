"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileText,
  RefreshCw,
  Lightbulb,
  BookOpen,
  Wand2,
  Copy,
  Check,
  Download,
  Loader2,
  Sparkles,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { generateText, generationTemplates, mockDocuments } from "@/lib/api"
import { cn } from "@/lib/utils"

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  FileText,
  RefreshCw,
  Lightbulb,
  BookOpen,
}

export default function GeneratePage() {
  const [selectedTemplate, setSelectedTemplate] = useState(generationTemplates[0])
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!input.trim() || isGenerating) return

    setIsGenerating(true)
    setOutput("")

    try {
      const result = await generateText(input, selectedTemplate.name)
      // Simulate streaming effect
      for (let i = 0; i <= result.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 10))
        setOutput(result.slice(0, i))
      }
    } catch {
      setOutput("An error occurred while generating text. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([output], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${selectedTemplate.name.toLowerCase()}-output.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleUseDocumentContent = (docName: string) => {
    setSelectedDocument(docName)
    setInput(
      `[Content from ${docName}]\n\nThe document discusses various topics including research findings, methodology, and conclusions. Use this content for the ${selectedTemplate.name.toLowerCase()} operation.`,
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Text Generator</h1>
        <p className="text-muted-foreground text-sm">
          Use AI Models to transform and generate content from your documents
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input panel */}
        <div className="space-y-4">
          {/* Template selector */}
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-medium mb-3">Choose Template</h3>
            <div className="grid grid-cols-2 gap-2">
              {generationTemplates.map((template) => {
                const Icon = iconMap[template.icon] || FileText
                return (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg text-left transition-all",
                      selectedTemplate.id === template.id
                        ? "bg-primary/10 border-2 border-primary/30"
                        : "bg-muted/50 border-2 border-transparent hover:border-border",
                    )}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        selectedTemplate.id === template.id ? "bg-primary text-primary-foreground" : "bg-background",
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{template.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{template.description}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Document selector */}
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-medium mb-3">Or use content from document</h3>
            <div className="space-y-2">
              {mockDocuments
                .filter((doc) => doc.status === "indexed")
                .map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => handleUseDocumentContent(doc.name)}
                    className={cn(
                      "w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors",
                      selectedDocument === doc.name
                        ? "bg-primary/10 border border-primary/20"
                        : "bg-muted/50 hover:bg-muted",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm truncate">{doc.name}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                ))}
            </div>
          </div>

          {/* Input area */}
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Input Content</h3>
              <span className="text-xs text-muted-foreground">{input.length} characters</span>
            </div>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Paste your content here to ${selectedTemplate.name.toLowerCase()}...`}
              className="min-h-[200px] resize-none bg-secondary/50"
            />
            <Button className="w-full mt-4 glow-sm" onClick={handleGenerate} disabled={!input.trim() || isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate with AI Models
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Output panel */}
        <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col h-[calc(100vh-16rem)] lg:h-auto lg:min-h-[600px]">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="font-medium">Generated Output</h3>
            </div>
            <AnimatePresence>
              {output && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="w-4 h-4 mr-1" />
                    Export
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <ScrollArea className="flex-1 p-4">
            {!output && !isGenerating ? (
              <div className="h-full flex items-center justify-center text-center py-12">
                <div>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Wand2 className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-medium mb-2">Ready to generate</h4>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Select a template, paste your content, and click generate to see the AI output here.
                  </p>
                </div>
              </div>
            ) : (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{output}</pre>
                {isGenerating && <span className="inline-block w-2 h-4 bg-primary animate-pulse" />}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
