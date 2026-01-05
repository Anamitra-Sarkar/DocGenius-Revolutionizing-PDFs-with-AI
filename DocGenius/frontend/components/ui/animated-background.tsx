"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"

// Particle system for hero background
export function ParticleField({ count = 50 }: { count?: number }) {
  const [particles, setParticles] = useState<
    Array<{
      id: number
      x: number
      y: number
      size: number
      duration: number
      delay: number
    }>
  >([])

  useEffect(() => {
    setParticles(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5,
      })),
    )
  }, [count])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-primary/30"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

// Animated mesh gradient orbs
export function MeshGradientOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Primary orb */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full"
        style={{
          background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
          opacity: 0.15,
          filter: "blur(60px)",
          top: "-20%",
          left: "-10%",
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Accent orb */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
          opacity: 0.12,
          filter: "blur(80px)",
          bottom: "-10%",
          right: "-5%",
        }}
        animate={{
          x: [0, -80, 0],
          y: [0, -60, 0],
          scale: [1.2, 1, 1.2],
        }}
        transition={{
          duration: 25,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Secondary orb */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
          opacity: 0.1,
          filter: "blur(100px)",
          top: "40%",
          right: "20%",
        }}
        animate={{
          x: [0, 60, 0],
          y: [0, -40, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 18,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </div>
  )
}

// Animated grid background
export function AnimatedGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <motion.div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, transparent, var(--background))",
        }}
      />
      {/* Scanning line effect */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
        animate={{ top: ["0%", "100%"] }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
    </div>
  )
}

// Interactive spotlight that follows mouse
export function SpotlightEffect() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const spotlightX = useSpring(mouseX, { stiffness: 100, damping: 30 })
  const spotlightY = useSpring(mouseY, { stiffness: 100, damping: 30 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-30 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      style={{
        background: useTransform(
          [spotlightX, spotlightY],
          ([x, y]) =>
            `radial-gradient(600px circle at ${x}px ${y}px, rgba(var(--primary-rgb, 139, 92, 246), 0.08), transparent 40%)`,
        ),
      }}
    />
  )
}

// Floating shapes
export function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            width: 100 + i * 40,
            height: 100 + i * 40,
            left: `${10 + i * 15}%`,
            top: `${20 + (i % 3) * 20}%`,
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        >
          <div
            className="w-full h-full rounded-3xl border border-primary/10"
            style={{
              background: `linear-gradient(135deg, transparent, rgba(var(--primary-rgb, 139, 92, 246), 0.05))`,
            }}
          />
        </motion.div>
      ))}
    </div>
  )
}

// Aurora borealis effect
export function AuroraEffect() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              125deg,
              transparent 0%,
              rgba(var(--primary-rgb, 139, 92, 246), 0.05) 15%,
              transparent 30%,
              rgba(var(--accent-rgb, 168, 85, 247), 0.08) 45%,
              transparent 60%,
              rgba(var(--primary-rgb, 139, 92, 246), 0.05) 75%,
              transparent 100%
            )
          `,
          backgroundSize: "400% 400%",
        }}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}

// Noise texture overlay
export function NoiseOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-[0.015] mix-blend-overlay"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }}
    />
  )
}

// Orbiting elements
export function OrbitingElements() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="relative w-[400px] h-[400px]">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 w-3 h-3"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            style={{
              transformOrigin: "0 0",
            }}
          >
            <motion.div
              className="w-3 h-3 rounded-full bg-primary/40"
              style={{
                transform: `translateX(${80 + i * 40}px)`,
                boxShadow: "0 0 20px var(--primary)",
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.3,
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Combined hero background
export function HeroBackground() {
  return (
    <div className="absolute inset-0 -z-10">
      <AuroraEffect />
      <MeshGradientOrbs />
      <ParticleField count={40} />
      <FloatingShapes />
      <NoiseOverlay />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
    </div>
  )
}

// Section divider wave
export function WaveDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div className={`absolute left-0 right-0 h-24 overflow-hidden ${flip ? "top-0 rotate-180" : "bottom-0"}`}>
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full">
        <motion.path
          fill="currentColor"
          className="text-background"
          initial={{ d: "M0,60 C200,100 400,20 600,60 C800,100 1000,20 1200,60 L1200,120 L0,120 Z" }}
          animate={{
            d: [
              "M0,60 C200,100 400,20 600,60 C800,100 1000,20 1200,60 L1200,120 L0,120 Z",
              "M0,60 C200,20 400,100 600,60 C800,20 1000,100 1200,60 L1200,120 L0,120 Z",
              "M0,60 C200,100 400,20 600,60 C800,100 1000,20 1200,60 L1200,120 L0,120 Z",
            ],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </svg>
    </div>
  )
}
