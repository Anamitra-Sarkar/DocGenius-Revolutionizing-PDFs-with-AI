"use client"

import { useState } from "react"
import Link from "next/link"
import { Upload, Search, Bell, ChevronDown, Settings, LogOut, FileText, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { MobileSidebar } from "./mobile-sidebar"

interface TopbarProps {
  onUploadClick: () => void
}

export function Topbar({ onUploadClick }: TopbarProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  return (
    <header className="h-16 bg-background border-b border-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      {/* Mobile menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          <MobileSidebar />
        </SheetContent>
      </Sheet>

      {/* Search */}
      <div className="flex-1 max-w-md mx-4 hidden sm:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            className={`pl-10 h-10 bg-secondary/50 border-transparent transition-all ${
              isSearchFocused ? "border-primary ring-1 ring-primary/20" : ""
            }`}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 text-xs bg-muted rounded font-mono hidden lg:inline-block">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 lg:gap-3">
        <Button onClick={onUploadClick} size="sm" className="hidden sm:flex glow-sm">
          <Upload className="w-4 h-4 mr-2" />
          Upload
        </Button>
        <Button onClick={onUploadClick} size="icon" className="sm:hidden">
          <Upload className="w-4 h-4" />
        </Button>

        <ThemeToggle />

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-4">
              <h4 className="font-semibold mb-2">Notifications</h4>
              <div className="space-y-3">
                <NotificationItem
                  title="Document indexed"
                  description="Research_Paper_2024.pdf has been processed"
                  time="2 min ago"
                />
                <NotificationItem
                  title="New feature"
                  description="Text generation is now available"
                  time="1 hour ago"
                />
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/professional-avatar.png" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <span className="hidden lg:inline-block text-sm font-medium">John Doe</span>
              <ChevronDown className="w-4 h-4 hidden lg:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-muted-foreground">john@example.com</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard">
                <FileText className="w-4 h-4 mr-2" />
                Documents
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/login">
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

function NotificationItem({ title, description, time }: { title: string; description: string; time: string }) {
  return (
    <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        <FileText className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground truncate">{description}</p>
        <p className="text-xs text-muted-foreground mt-1">{time}</p>
      </div>
    </div>
  )
}
