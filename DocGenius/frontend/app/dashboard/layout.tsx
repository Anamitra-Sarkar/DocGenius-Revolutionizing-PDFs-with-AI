"use client"

import type React from "react"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Topbar } from "@/components/dashboard/topbar"
import { UploadModal } from "@/components/dashboard/upload-modal"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - hidden on mobile */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="lg:pl-[240px] min-h-screen flex flex-col">
        <Topbar onUploadClick={() => setIsUploadModalOpen(true)} />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>

      {/* Upload modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={() => {
          // Refresh documents
        }}
      />
    </div>
  )
}
