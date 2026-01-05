"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { FileText, Github, Twitter, Linkedin, ArrowUpRight, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import { Input } from "@/components/ui/input"

const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Documentation", href: "#" },
  ],
  company: [
    { label: "About", href: "#" },
    { label: "Contact", href: "#" },
  ],
  resources: [
    { label: "Help Center", href: "#" },
  ],
  legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
  ],
}

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
]

export function Footer() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <footer className="relative border-t border-border bg-muted/30 overflow-hidden" ref={ref}>
      {/* Background decoration */}
      <div className="absolute inset-0 grid-pattern opacity-10" />
      <motion.div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
      />

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Newsletter section */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-16 mt-16">
          {/* Brand column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="col-span-2"
          >
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <Logo className="w-10 h-10" />
              <span className="font-bold text-xl">
                Doc<span className="text-gradient">Genius</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              AI-powered document intelligence for everyone. Transform how you interact with your documents.
            </p>
            <div className="flex items-center gap-2">
              {socialLinks.map((social, index) => (
                <motion.div
                  key={social.label}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                >
                  <Link
                    href={social.href}
                    className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all group"
                  >
                    <social.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="sr-only">{social.label}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + categoryIndex * 0.1 }}
            >
              <h4 className="font-semibold mb-4 capitalize">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2 group"
                    >
                      {link.label}

                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} DocGenius. All rights reserved.</p>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            Made with
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
              className="text-primary"
            >
              ♥
            </motion.span>
            for humans who love documents
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
