"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  FileText,
  Mic,
  Mail,
  BrainCircuit,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { User } from "@prisma/client";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Industry insights & overview",
  },
  {
    label: "Resume Builder",
    href: "/resume",
    icon: FileText,
    description: "Build & enhance your resume",
  },
  {
    label: "Interview Prep",
    href: "/interview",
    icon: Mic,
    description: "AI mock interview practice",
  },
  {
    label: "Cover Letter",
    href: "/ai-cover-letter",
    icon: Mail,
    description: "Generate cover letters",
  },
];

interface SidebarProps {
  user: User;
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border/60 bg-card/50 backdrop-blur-sm">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-border/60">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-lg gradient-title">Nexora AI</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-3">
          Career Tools
        </p>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-violet-500/15 text-violet-400 border border-violet-500/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
            >
              <item.icon
                className={cn(
                  "w-4 h-4 shrink-0 transition-colors",
                  isActive ? "text-violet-400" : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              <div className="flex-1 min-w-0">
                <span className="block">{item.label}</span>
                <span className="block text-[10px] font-normal text-muted-foreground/70 truncate">
                  {item.description}
                </span>
              </div>
              {isActive && (
                <ChevronRight className="w-3 h-3 text-violet-400 shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-border/60">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-muted/60 transition-colors">
          <UserButton
            appearance={{
              elements: { avatarBox: "w-8 h-8" },
            }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name || "User"}</p>
            <p className="text-xs text-muted-foreground truncate">
              {user.industry?.replace(/-/g, " ") || "Career Explorer"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}