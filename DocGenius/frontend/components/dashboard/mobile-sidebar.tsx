"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileText, FolderOpen, MessageSquare, Wand2, Settings, LogOut, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/ui/logo"

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

export function MobileSidebar() {
  const pathname = usePathname()

  return (
    <div className="h-full bg-sidebar flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-3">
          <Logo className="w-9 h-9" />
          <span className="font-semibold text-lg">DocGenius</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
              pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="py-4 px-3 border-t border-sidebar-border space-y-1">
        {bottomItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
