import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="text-center mb-2">
          <h1 className="text-3xl font-black gradient-title">Nexora AI</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Start your AI-powered career journey today
          </p>
        </div>
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-card border border-border shadow-xl shadow-black/20",
              headerTitle: "text-foreground font-bold",
              headerSubtitle: "text-muted-foreground",
              socialButtonsBlockButton:
                "border border-border bg-background hover:bg-muted text-foreground",
              formFieldLabel: "text-foreground font-medium",
              formFieldInput:
                "bg-background border-border text-foreground focus:ring-violet-500",
              footerActionLink: "text-violet-400 hover:text-violet-300",
              formButtonPrimary:
                "bg-violet-600 hover:bg-violet-700 text-white font-semibold",
            },
          }}
        />
      </div>
    </div>
  );
}