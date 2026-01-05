"use client"

import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
    return (
        <div className={cn("relative flex items-center justify-center w-10 h-10", className)}>
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
                <defs>
                    <linearGradient id="logo-gradient" x1="5" y1="5" x2="35" y2="35" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="var(--primary)" />
                        <stop offset="100%" stopColor="var(--accent)" />
                    </linearGradient>
                    <linearGradient id="logo-shine" x1="0" y1="0" x2="40" y2="0" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="white" stopOpacity="0" />
                        <stop offset="50%" stopColor="white" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="white" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Main Shape with rounded corners */}
                <rect x="6" y="6" width="28" height="28" rx="8" fill="url(#logo-gradient)" />

                {/* Scan lines / Circuit pattern */}
                <path d="M12 16H20" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.9" />
                <path d="M12 21H28" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.8" />
                <path d="M12 26H22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.7" />

                {/* Tech dot accent */}
                <circle cx="28" cy="16" r="2.5" fill="white" fillOpacity="0.9" />
            </svg>

            {/* Optional glow effect behind */}
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full -z-10" />
        </div>
    )
}
