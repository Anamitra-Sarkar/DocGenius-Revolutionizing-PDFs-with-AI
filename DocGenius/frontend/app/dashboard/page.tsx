"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FileText, MoreVertical, Search, Grid, List, Clock, CheckCircle, Loader2, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchDocuments, type Document } from "@/lib/api"

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    setIsLoading(true)
    const docs = await fetchDocuments()
    setDocuments(docs)
    setIsLoading(false)
  }

  const filteredDocuments = documents.filter((doc) => doc.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Documents</h1>
          <p className="text-muted-foreground text-sm">Manage and organize your uploaded PDFs</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              className="pl-10 bg-secondary/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className={viewMode === "grid" ? "bg-secondary" : ""}
            onClick={() => setViewMode("grid")}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={viewMode === "list" ? "bg-secondary" : ""}
            onClick={() => setViewMode("list")}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <DocumentSkeleton key={i} viewMode={viewMode} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && documents.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16"
        >
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <FolderOpen className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No documents yet</h3>
          <p className="text-muted-foreground text-sm text-center max-w-sm mb-6">
            Upload your first PDF to get started with AI-powered document intelligence
          </p>
          <Button className="glow-sm">Upload Document</Button>
        </motion.div>
      )}

      {/* Document grid/list */}
      {!isLoading && filteredDocuments.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}
        >
          {filteredDocuments.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <DocumentCard doc={doc} viewMode={viewMode} formatFileSize={formatFileSize} formatDate={formatDate} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* No results */}
      {!isLoading && documents.length > 0 && filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No documents matching "{searchQuery}"</p>
        </div>
      )}
    </div>
  )
}

function DocumentCard({
  doc,
  viewMode,
  formatFileSize,
  formatDate,
}: {
  doc: Document
  viewMode: "grid" | "list"
  formatFileSize: (bytes: number) => string
  formatDate: (date: Date) => string
}) {
  if (viewMode === "list") {
    return (
      <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-colors group">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <FileText className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{doc.name}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
            <span>{formatFileSize(doc.size)}</span>
            <span>{doc.pageCount} pages</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDate(doc.uploadedAt)}
            </span>
          </div>
        </div>
        <StatusBadge status={doc.status} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Open</DropdownMenuItem>
            <DropdownMenuItem>Chat with document</DropdownMenuItem>
            <DropdownMenuItem>Download</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors group">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <FileText className="w-6 h-6 text-primary" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Open</DropdownMenuItem>
            <DropdownMenuItem>Chat with document</DropdownMenuItem>
            <DropdownMenuItem>Download</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <h3 className="font-medium truncate mb-2">{doc.name}</h3>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {formatFileSize(doc.size)} • {doc.pageCount} pages
        </span>
        <StatusBadge status={doc.status} />
      </div>
      <p className="text-xs text-muted-foreground mt-2">{formatDate(doc.uploadedAt)}</p>
    </div>
  )
}

function StatusBadge({ status }: { status: Document["status"] }) {
  if (status === "indexed") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-green-500/10 text-green-600 dark:text-green-400">
        <CheckCircle className="w-3 h-3" />
        Indexed
      </span>
    )
  }
  if (status === "processing") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary">
        <Loader2 className="w-3 h-3 animate-spin" />
        Processing
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-destructive/10 text-destructive">
      Error
    </span>
  )
}

function DocumentSkeleton({ viewMode }: { viewMode: "grid" | "list" }) {
  if (viewMode === "list") {
    return (
      <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <div className="flex-1">
          <Skeleton className="h-4 w-48 mb-2" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <Skeleton className="w-12 h-12 rounded-xl mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-3 w-24" />
    </div>
  )
}
