"use client"

import { useRef } from "react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Check, Sparkles, Zap, Shield, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MagneticButton, AnimatedCard } from "@/components/ui/animated-card"
import { MeshGradientOrbs, ParticleField } from "@/components/ui/animated-background"

const benefits = [
  { icon: Check, text: "Instant analysis" },
  { icon: Zap, text: "Advanced AI models" },
  { icon: Shield, text: "Secure processing" },
  { icon: Clock, text: "Real-time answers" },
]

export function CTA() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1])

  return (
    <section className="py-32 relative overflow-hidden" ref={containerRef}>
      {/* Animated background */}
      <div className="absolute inset-0">
        <MeshGradientOrbs />
        <ParticleField count={30} />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />

      <motion.div className="container mx-auto px-4 relative z-10" style={{ scale, opacity }}>
        {/* Main CTA card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <AnimatedCard className="overflow-hidden" tilt={false}>
            <div className="relative p-8 md:p-16">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-accent/20 to-transparent rounded-full blur-3xl" />

              <div className="relative z-10 text-center">
                {/* Badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <Sparkles className="w-4 h-4 text-primary" />
                  </motion.div>
                  <span className="text-sm font-medium text-primary">Start analyzing documents</span>
                </motion.div>

                {/* Headline */}
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight text-balance">
                  Ready to transform how you work with <span className="text-gradient">documents</span>?
                </h2>

                <p className="text-muted-foreground text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                  Join thousands of students, researchers, and professionals who are already using DocGenius to unlock
                  insights from their documents.
                </p>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 }}
                  className="mb-10"
                >
                  <MagneticButton>
                    <Link href="/signup">
                      <Button
                        size="lg"
                        className="relative h-16 px-12 text-lg font-semibold glow overflow-hidden group"
                      >
                        <span className="relative z-10 flex items-center gap-3">
                          Get Started
                          <motion.span
                            animate={{ x: [0, 6, 0] }}
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
                </motion.div>

                {/* Benefits */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.6 }}
                  className="flex flex-wrap items-center justify-center gap-6"
                >
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={benefit.text}
                      initial={{ opacity: 0, y: 10 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <benefit.icon className="w-3 h-3 text-primary" />
                      </div>
                      <span>{benefit.text}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </AnimatedCard>
        </motion.div>
      </motion.div>
    </section>
  )
}
