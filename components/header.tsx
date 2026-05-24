import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { BrainCircuit } from "lucide-react";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-black text-xl">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <span className="gradient-title">Nexora AI</span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            href="/dashboard"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/resume"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Resume
          </Link>
          <Link
            href="/interview"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Interview Prep
          </Link>
          <Link
            href="/ai-cover-letter"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Cover Letter
          </Link>
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-3">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </SignInButton>
            <Button
              asChild
              size="sm"
              className="bg-violet-600 hover:bg-violet-700 text-white"
            >
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9",
                },
              }}
            />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}