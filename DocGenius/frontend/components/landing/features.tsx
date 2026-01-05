"use client"

import type React from "react"
import { useRef } from "react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { FileUp, Search, MessageSquareText, Wand2, Zap, Lock, Brain, Layers, Globe, Shield } from "lucide-react"
import { AnimatedCard, GlowingIcon } from "@/components/ui/animated-card"
import { WaveDivider } from "@/components/ui/animated-background"

const features = [
  {
    icon: FileUp,
    title: "PDF Upload & Chunking",
    description:
      "Upload any PDF document and we'll intelligently split it into semantic chunks for optimal processing and retrieval.",
    color: "primary" as const,
    gradient: "from-primary/20 to-primary/5",
  },
  {
    icon: Search,
    title: "Semantic Search",
    description:
      "Powered by AI Models embeddings and FAISS vector database, find exactly what you need across all your documents instantly.",
    color: "accent" as const,
    gradient: "from-accent/20 to-accent/5",
  },
  {
    icon: MessageSquareText,
    title: "Chat with Documents",
    description:
      "Have natural conversations with your documents. Ask questions and get accurate answers with source citations.",
    color: "primary" as const,
    gradient: "from-primary/20 to-primary/5",
  },
  {
    icon: Wand2,
    title: "AI-Powered Writing",
    description:
      "Generate summaries, rewrite content, create study notes, and more using powerful AI Models.",
    color: "accent" as const,
    gradient: "from-accent/20 to-accent/5",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized vector search and caching ensure you get answers in milliseconds, not minutes.",
    color: "primary" as const,
    gradient: "from-primary/20 to-primary/5",
  },
  {
    icon: Lock,
    title: "Secure & Private",
    description:
      "Your documents are encrypted and never used to train AI models. Enterprise-grade security by default.",
    color: "accent" as const,
    gradient: "from-accent/20 to-accent/5",
  },
]

const capabilities = [
  { icon: Brain, label: "Advanced AI", value: "Advanced AI Models" },
  { icon: Layers, label: "Vector Store", value: "FAISS Optimized" },
  { icon: Globe, label: "Languages", value: "100+ Supported" },
  { icon: Shield, label: "Security", value: "SOC 2 Type II" },
]

export function Features() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])

  return (
    <section id="features" className="py-32 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
      <motion.div className="absolute inset-0 opacity-30" style={{ y }}>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10" ref={containerRef}>
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 mb-6"
          >
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Powerful Features</span>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Everything you need to unlock
            <br />
            <span className="text-gradient">document intelligence</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            From upload to insights, DocGenius provides a complete toolkit for working with your documents.
          </p>
        </motion.div>

        {/* Capabilities bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-20"
        >
          <AnimatedCard className="w-full" tilt={false}>
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                {capabilities.map((cap, index) => (
                  <motion.div
                    key={cap.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="text-center group"
                  >
                    <motion.div
                      className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center text-primary"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <cap.icon className="w-6 h-6" />
                    </motion.div>
                    <div className="text-sm text-muted-foreground mb-1">{cap.label}</div>
                    <div className="text-sm font-semibold">{cap.value}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedCard>
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <FeatureCard {...feature} index={index} />
            </motion.div>
          ))}
        </div>
      </div>

      <WaveDivider />
    </section>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  color,
  gradient,
  index,
}: {
  icon: React.ElementType
  title: string
  description: string
  color: "primary" | "accent"
  gradient: string
  index: number
}) {
  const cardRef = useRef<HTMLDivElement>(null)

  return (
    <AnimatedCard className="h-full" glowColor={color === "primary" ? "var(--primary)" : "var(--accent)"}>
      <div className="p-6 md:p-8 h-full flex flex-col">
        {/* Icon with animated background */}
        <div className="relative mb-6">
          <motion.div
            className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} blur-2xl opacity-50`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              delay: index * 0.2,
            }}
          />
          <GlowingIcon color={color} className="w-14 h-14 relative">
            <Icon className="w-7 h-7" />
          </GlowingIcon>
        </div>

        {/* Content */}
        <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed flex-1">{description}</p>

        {/* Learn more link */}
        <motion.div
          className="mt-6 flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity"
          initial={false}
          whileHover={{ x: 4 }}
        >
          Learn more
          <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}>
            →
          </motion.span>
        </motion.div>
      </div>
    </AnimatedCard>
  )
}
