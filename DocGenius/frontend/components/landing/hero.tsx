"use client"

import type React from "react"
import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Play, Sparkles, FileSearch, MessageSquare, Wand2, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeroBackground, OrbitingElements } from "@/components/ui/animated-background"
import { AnimatedCard, MagneticButton, TextReveal } from "@/components/ui/animated-card"

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      <HeroBackground />

      {/* Orbiting elements around the main content */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
        <OrbitingElements />
      </div>

      <motion.div className="container mx-auto px-4 relative z-10" style={{ y, opacity, scale }}>
        <div className="max-w-5xl mx-auto text-center">
          {/* Animated badge */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
            className="inline-flex items-center gap-2 mb-8"
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 rounded-full bg-primary/30 blur-md"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
              <div className="relative px-5 py-2.5 rounded-full glass border border-primary/30 flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4 text-primary" />
                </motion.div>
                <span className="text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Powered by AI Models
                </span>
                <motion.div
                  className="w-2 h-2 rounded-full bg-green-500"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                />
              </div>
            </div>
          </motion.div>

          {/* Main headline with text reveal */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 text-balance leading-[1.1]"
          >
            <TextReveal delay={0.3}>Turn Your PDFs Into</TextReveal>
            <br />
            <span className="text-gradient inline-block mt-2">
              <TextReveal delay={0.5}>Intelligent Conversations</TextReveal>
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto text-pretty leading-relaxed"
          >
            Upload documents. Ask questions. Generate insights.
            <span className="text-foreground font-medium"> DocGenius </span>
            uses semantic search and AI to help unlock knowledge from your documents.
          </motion.p>

          {/* CTA Buttons with magnetic effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <MagneticButton>
              <Link href="/signup">
                <Button size="lg" className="relative h-14 px-10 text-base font-medium glow overflow-hidden group">
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started Free
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.span>
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary"
                    style={{ backgroundSize: "200% 100%" }}
                    animate={{
                      backgroundPosition: ["0% 0%", "200% 0%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  />
                </Button>
              </Link>
            </MagneticButton>

            <MagneticButton>
              <Link href="#how-it-works">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 px-10 text-base font-medium glass-hover border-border/50 group bg-transparent"
                >
                  <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                  See How It Works
                </Button>
              </Link>
            </MagneticButton>
          </motion.div>

          {/* Enhanced flow diagram */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <AnimatedCard className="max-w-4xl mx-auto" tilt={false} shine>
              <div className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-4">
                  <FlowStep
                    icon={<FileSearch className="w-6 h-6" />}
                    label="Upload PDF"
                    description="Drag & drop any document"
                    delay={1.2}
                    index={0}
                  />
                  <FlowConnector delay={1.3} />
                  <FlowStep
                    icon={<Zap className="w-6 h-6" />}
                    label="AI Embeddings"
                    description="Semantic processing"
                    delay={1.4}
                    index={1}
                  />
                  <FlowConnector delay={1.5} />
                  <FlowStep
                    icon={<MessageSquare className="w-6 h-6" />}
                    label="Ask Questions"
                    description="Natural conversations"
                    delay={1.6}
                    index={2}
                  />
                  <FlowConnector delay={1.7} />
                  <FlowStep
                    icon={<Wand2 className="w-6 h-6" />}
                    label="Get Insights"
                    description="Actionable knowledge"
                    delay={1.8}
                    index={3}
                  />
                </div>
              </div>
            </AnimatedCard>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2 }}
            className="flex flex-wrap items-center justify-center gap-8 md:gap-16 mt-16"
          >
            <StatItem value="10K+" label="Documents Processed" />
            <StatItem value="50K+" label="Questions Answered" />
            <StatItem value="99.9%" label="Accuracy Rate" />
            <StatItem value="<1s" label="Response Time" />
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-primary"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          />
        </div>
      </motion.div>
    </section>
  )
}

function FlowStep({
  icon,
  label,
  description,
  delay,
  index,
}: {
  icon: React.ReactNode
  label: string
  description: string
  delay: number
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col items-center gap-3 group"
    >
      <motion.div
        className="relative"
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <motion.div
          className="absolute inset-0 rounded-2xl bg-primary/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.2 }}
        />
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 flex items-center justify-center text-primary group-hover:border-primary/40 transition-colors">
          {icon}
        </div>
      </motion.div>
      <div className="text-center">
        <span className="text-sm font-semibold block">{label}</span>
        <span className="text-xs text-muted-foreground">{description}</span>
      </div>
    </motion.div>
  )
}

function FlowConnector({ delay }: { delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ duration: 0.4, delay }}
      className="hidden md:flex items-center gap-1"
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.2,
          }}
        />
      ))}
    </motion.div>
  )
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <motion.div
      className="text-center group"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <div className="text-2xl md:text-3xl font-bold text-gradient mb-1">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </motion.div>
  )
}
