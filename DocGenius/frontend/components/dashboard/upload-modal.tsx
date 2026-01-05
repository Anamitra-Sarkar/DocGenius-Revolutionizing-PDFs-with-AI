"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useDropzone } from "react-dropzone"
import { X, Upload, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUploadComplete: () => void
}

interface UploadFile {
  id: string
  file: File
  progress: number
  status: "pending" | "uploading" | "processing" | "complete" | "error"
  error?: string
}

export function UploadModal({ isOpen, onClose, onUploadComplete }: UploadModalProps) {
  const [files, setFiles] = useState<UploadFile[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadFile[] = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: "pending",
    }))
    setFiles((prev) => [...prev, ...newFiles])

    // Simulate upload for each file
    newFiles.forEach((uploadFile) => {
      simulateUpload(uploadFile.id)
    })
  }, [])

  const simulateUpload = async (fileId: string) => {
    // Start uploading
    setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: "uploading" } : f)))

    // Simulate progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise((resolve) => setTimeout(resolve, 100))
      setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, progress } : f)))
    }

    // Processing
    setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: "processing" } : f)))
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Complete
    setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: "complete" } : f)))
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
  })

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const handleClose = () => {
    const hasCompleted = files.some((f) => f.status === "complete")
    if (hasCompleted) {
      onUploadComplete()
    }
    setFiles([])
    onClose()
  }

  const allComplete = files.length > 0 && files.every((f) => f.status === "complete")

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Documents</DialogTitle>
        </DialogHeader>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50"
          }`}
        >
          <input {...getInputProps()} />
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Upload className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm font-medium mb-1">
            {isDragActive ? "Drop your PDF here" : "Drag & drop your PDF here"}
          </p>
          <p className="text-xs text-muted-foreground">or click to browse (max 50MB)</p>
        </div>

        {/* File list */}
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              {files.map((uploadFile) => (
                <motion.div
                  key={uploadFile.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{uploadFile.file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    {uploadFile.status === "uploading" && <Progress value={uploadFile.progress} className="h-1 mt-2" />}
                    {uploadFile.status === "processing" && (
                      <p className="text-xs text-primary mt-1 flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Processing document...
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    {uploadFile.status === "complete" && <CheckCircle className="w-5 h-5 text-green-500" />}
                    {uploadFile.status === "error" && <AlertCircle className="w-5 h-5 text-destructive" />}
                    {uploadFile.status === "pending" && (
                      <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => removeFile(uploadFile.id)}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                    {(uploadFile.status === "uploading" || uploadFile.status === "processing") && (
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        {allComplete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-end gap-2">
            <Button onClick={handleClose}>Done</Button>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  )
}
