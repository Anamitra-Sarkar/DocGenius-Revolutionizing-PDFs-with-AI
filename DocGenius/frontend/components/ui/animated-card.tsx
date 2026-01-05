"use client"

import type React from "react"
import { useRef, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedCardProps {
  children: React.ReactNode
  className?: string
  glowColor?: string
  borderGradient?: boolean
  tilt?: boolean
  spotlight?: boolean
  shine?: boolean
}

export function AnimatedCard({
  children,
  className,
  glowColor = "var(--primary)",
  borderGradient = true,
  tilt = true,
  spotlight = true,
  shine = true,
}: AnimatedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(mouseX, {
    stiffness: 300,
    damping: 30,
  })
  const rotateY = useSpring(mouseY, {
    stiffness: 300,
    damping: 30,
  })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || !tilt) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }

  const spotlightBackground = `radial-gradient(400px circle at 50% 50%, ${glowColor}15, transparent 40%)`

  return (
    <motion.div
      ref={cardRef}
      className={cn("relative group", className)}
      style={{
        perspective: 1000,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Animated border gradient */}
      {borderGradient && (
        <motion.div
          className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(var(--border-angle, 0deg), ${glowColor}, var(--accent), ${glowColor})`,
            filter: "blur(2px)",
          }}
          animate={
            {
              "--border-angle": ["0deg", "360deg"],
            } as unknown as Record<string, string[]>
          }
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      )}

      {/* Main card content */}
      <motion.div
        className={cn(
          "relative rounded-2xl bg-card/80 backdrop-blur-xl border border-border/50 overflow-hidden",
          "transition-all duration-500",
          "group-hover:border-transparent group-hover:shadow-2xl",
        )}
        style={{
          rotateX: tilt ? rotateX : 0,
          rotateY: tilt ? rotateY : 0,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Spotlight effect */}
        {spotlight && (
          <motion.div
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: spotlightBackground,
            }}
          />
        )}

        {/* Shine effect */}
        {shine && (
          <motion.div
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100"
            style={{
              background: `linear-gradient(
                105deg,
                transparent 40%,
                rgba(255, 255, 255, 0.03) 45%,
                rgba(255, 255, 255, 0.1) 50%,
                rgba(255, 255, 255, 0.03) 55%,
                transparent 60%
              )`,
              backgroundSize: "200% 100%",
            }}
            animate={{
              backgroundPosition: isHovered ? ["200% 0", "-200% 0"] : "200% 0",
            }}
            transition={{
              duration: 1.5,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Glow effect */}
        <motion.div
          className="pointer-events-none absolute -inset-4 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10"
          style={{
            background: `radial-gradient(300px circle, ${glowColor}20, transparent 60%)`,
            filter: "blur(20px)",
          }}
        />

        {/* Content */}
        <div style={{ transform: "translateZ(20px)" }}>{children}</div>
      </motion.div>
    </motion.div>
  )
}

// Bento grid card with special effects
export function BentoCard({
  children,
  className,
  size = "default",
}: {
  children: React.ReactNode
  className?: string
  size?: "default" | "large" | "tall" | "wide"
}) {
  const sizeClasses = {
    default: "",
    large: "md:col-span-2 md:row-span-2",
    tall: "md:row-span-2",
    wide: "md:col-span-2",
  }

  return (
    <AnimatedCard className={cn(sizeClasses[size], className)} tilt={size === "large"}>
      {children}
    </AnimatedCard>
  )
}

// Icon with glow effect
export function GlowingIcon({
  children,
  className,
  color = "primary",
}: {
  children: React.ReactNode
  className?: string
  color?: "primary" | "accent"
}) {
  return (
    <motion.div
      className={cn(
        "relative flex items-center justify-center rounded-xl p-3",
        color === "primary" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent",
        className,
      )}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            color === "primary"
              ? "radial-gradient(circle, var(--primary) 0%, transparent 70%)"
              : "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
          filter: "blur(12px)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

// Animated counter
export function AnimatedCounter({
  value,
  className,
}: {
  value: number
  className?: string
}) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        {value.toLocaleString()}
      </motion.span>
    </motion.span>
  )
}

// Magnetic button effect
export function MagneticButton({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springX = useSpring(x, { stiffness: 150, damping: 15 })
  const springY = useSpring(y, { stiffness: 150, damping: 15 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * 0.2)
    y.set((e.clientY - centerY) * 0.2)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={cn("inline-block", className)}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  )
}

// Text reveal animation
export function TextReveal({
  children,
  className,
  delay = 0,
}: {
  children: string
  className?: string
  delay?: number
}) {
  const words = children.split(" ")

  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{
              duration: 0.5,
              delay: delay + i * 0.05,
              ease: [0.33, 1, 0.68, 1],
            }}
          >
            {word}
          </motion.span>
          <span>&nbsp;</span>
        </span>
      ))}
    </span>
  )
}

// Staggered list animation
export function StaggeredList({
  children,
  className,
  staggerDelay = 0.1,
}: {
  children: React.ReactNode[]
  className?: string
  staggerDelay?: number
}) {
  return (
    <div className={className}>
      {children.map((child, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: i * staggerDelay,
            ease: [0.33, 1, 0.68, 1],
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  )
}
