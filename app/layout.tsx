import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Nexora AI – Intelligent Career Guidance Platform",
    template: "%s | Nexora AI",
  },
  description:
    "AI-powered career coaching platform. Get personalized career guidance, resume help, interview prep, and industry insights.",
  keywords: [
    "career coaching",
    "AI career guidance",
    "resume builder",
    "interview prep",
    "job search",
  ],
  authors: [{ name: "Nexora AI" }],
  openGraph: {
    title: "Nexora AI – Intelligent Career Guidance",
    description: "AI-powered career coaching platform",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} font-sans antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster richColors position="bottom-right" />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}