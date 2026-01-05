"use client"

import type React from "react"

import Link from "next/link"
import { motion } from "framer-motion"
import { FileText } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/20 via-background to-accent/20 relative overflow-hidden">
        {/* Animated background orbs */}
        <motion.div
          className="absolute top-1/3 left-1/4 w-72 h-72 bg-primary/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-accent/30 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-semibold text-xl">DocGenius</span>
          </Link>

          <div className="max-w-md">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl font-bold mb-4"
            >
              Transform your documents into intelligent conversations
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-muted-foreground"
            >
              Upload PDFs, ask questions, and generate insights with AI-powered document intelligence.
            </motion.p>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span>Trusted by 10,000+ users</span>
            <span>•</span>
            <span>Enterprise-grade security</span>
          </div>
        </div>
      </div>

      {/* Right panel - auth form */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-4 lg:p-6">
          <Link href="/" className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold">DocGenius</span>
          </Link>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">{children}</div>
      </div>
    </div>
  )
}
