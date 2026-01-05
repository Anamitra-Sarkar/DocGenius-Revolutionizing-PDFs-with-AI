"use client"

import type React from "react"
import { useRef } from "react"
import { motion, useInView, useScroll } from "framer-motion"
import { Upload, Brain, MessagesSquare, Sparkles, ArrowDown, CheckCircle2 } from "lucide-react"
import { AnimatedCard } from "@/components/ui/animated-card"

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload Your Documents",
    description:
      "Drag and drop your PDF files or click to upload. We support documents up to 50MB with automatic text extraction and OCR for scanned files.",
    features: ["Batch upload support", "OCR for scanned PDFs", "50MB max file size"],
    color: "from-blue-500 to-cyan-500",
  },
  {
    number: "02",
    icon: Brain,
    title: "AI Processing",
    description:
      "Our system chunks your document intelligently, generates embeddings using AI Models, and indexes everything in our high-performance vector database.",
    features: ["Semantic chunking", "AI embeddings", "FAISS indexing"],
    color: "from-violet-500 to-purple-500",
  },
  {
    number: "03",
    icon: MessagesSquare,
    title: "Ask Questions",
    description:
      "Chat naturally with your documents using advanced retrieval-augmented generation. Get accurate, contextual answers with source citations.",
    features: ["Natural language", "Source citations", "Multi-document Q&A"],
    color: "from-pink-500 to-rose-500",
  },
  {
    number: "04",
    icon: Sparkles,
    title: "Generate Content",
    description:
      "Use AI Models to summarize, rewrite, explain, or generate comprehensive study notes from your documents with a single click.",
    features: ["Summaries", "Rewrites", "Study notes"],
    color: "from-amber-500 to-orange-500",
  },
]

export function HowItWorks() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  return (
    <section id="how-it-works" className="py-32 relative overflow-hidden bg-muted/30" ref={containerRef}>
      {/* Animated background grid */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Floating orbs */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/10 blur-3xl"
        animate={{
          y: [0, 50, 0],
          x: [0, 30, 0],
        }}
        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-accent/10 blur-3xl"
        animate={{
          y: [0, -50, 0],
          x: [0, -30, 0],
        }}
        transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, type: "spring" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-accent/20 mb-6"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Brain className="w-4 h-4 text-accent" />
            </motion.div>
            <span className="text-sm font-medium">Simple Process</span>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            How DocGenius <span className="text-gradient">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            From upload to insights in four simple steps. Our AI handles the complexity so you can focus on what
            matters.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <StepCard {...step} index={index} isLast={index === steps.length - 1} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function StepCard({
  number,
  icon: Icon,
  title,
  description,
  features,
  color,
  index,
  isLast,
}: {
  number: string
  icon: React.ElementType
  title: string
  description: string
  features: string[]
  color: string
  index: number
  isLast: boolean
}) {
  return (
    <div className="relative pb-16 last:pb-0">
      {/* Connecting line */}
      {!isLast && (
        <div className="absolute left-8 md:left-1/2 top-24 bottom-0 w-px md:-translate-x-1/2">
          <motion.div
            className="h-full w-full bg-gradient-to-b from-primary via-accent to-transparent"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ transformOrigin: "top" }}
          />
        </div>
      )}

      <div
        className={`flex flex-col md:flex-row items-start gap-6 md:gap-12 ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}
      >
        {/* Number badge */}
        <motion.div
          className="relative z-10 flex-shrink-0"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <motion.div
            className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${color} blur-2xl opacity-40`}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: index * 0.2 }}
          />
          <div
            className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-xl shadow-lg`}
          >
            {number}
          </div>
        </motion.div>

        {/* Content card */}
        <div className="flex-1 md:max-w-[calc(50%-4rem)]">
          <AnimatedCard>
            <div className="p-6 md:p-8">
              <div className="flex items-start gap-4 mb-4">
                <motion.div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} bg-opacity-10 flex items-center justify-center`}
                  whileHover={{ rotate: 10 }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold">{title}</h3>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-6">{description}</p>

              {/* Feature list */}
              <div className="flex flex-wrap gap-3">
                {features.map((feature, i) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/80 text-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                    {feature}
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedCard>
        </div>
      </div>

      {/* Arrow indicator */}
      {!isLast && (
        <motion.div
          className="hidden md:flex absolute left-1/2 -translate-x-1/2 bottom-4"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <ArrowDown className="w-5 h-5 text-primary" />
        </motion.div>
      )}
    </div>
  )
}
