"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileText,
  FolderOpen,
  MessageSquare,
  Wand2,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  HelpCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const navItems = [
  { href: "/dashboard", icon: FolderOpen, label: "Documents" },
  { href: "/dashboard/chat", icon: MessageSquare, label: "Chat" },
  { href: "/dashboard/generate", icon: Wand2, label: "Text Generator" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
]

const bottomItems = [
  { href: "#", icon: HelpCircle, label: "Help & Support" },
  { href: "/login", icon: LogOut, label: "Sign Out" },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 72 : 240 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="h-screen bg-sidebar border-r border-sidebar-border flex flex-col fixed left-0 top-0 z-40"
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
          <Link href="/dashboard" className="flex items-center gap-3">
            <Logo className="w-9 h-9" />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="font-semibold text-lg overflow-hidden whitespace-nowrap"
                >
                  DocGenius
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              isActive={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>

        {/* Bottom section */}
        <div className="py-4 px-3 border-t border-sidebar-border space-y-1">
          {bottomItems.map((item) => (
            <NavItem key={item.href} {...item} isActive={false} isCollapsed={isCollapsed} />
          ))}
        </div>

        {/* Collapse toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-sidebar border border-sidebar-border shadow-sm hover:bg-sidebar-accent"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </Button>
      </motion.aside>
    </TooltipProvider>
  )
}

function NavItem({
  href,
  icon: Icon,
  label,
  isActive,
  isCollapsed,
}: {
  href: string
  icon: React.ElementType
  label: string
  isActive: boolean
  isCollapsed: boolean
}) {
  const content = (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
      )}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <AnimatePresence>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="text-sm font-medium overflow-hidden whitespace-nowrap"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  )

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" className="font-medium">
          {label}
        </TooltipContent>
      </Tooltip>
    )
  }

  return content
}
