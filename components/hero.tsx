"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp, FileText, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: TrendingUp,
    title: "Industry Insights",
    description: "Real-time salary trends, demand levels, and growth forecasts",
  },
  {
    icon: FileText,
    title: "AI Resume Builder",
    description: "Create and enhance your resume with AI-powered suggestions",
  },
  {
    icon: Mic,
    title: "Mock Interviews",
    description: "Practice with AI-generated questions tailored to your field",
  },
  {
    icon: Sparkles,
    title: "Cover Letters",
    description: "Generate personalized cover letters for any job application",
  },
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden hero-gradient">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />

      {/* Glow orbs */}
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <Badge
            variant="secondary"
            className="px-4 py-1.5 text-sm font-medium gap-2 border border-violet-500/30 bg-violet-500/10 text-violet-400"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Powered by Google Gemini AI
          </Badge>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-none">
          <span className="gradient-title">Accelerate Your</span>
          <br />
          <span className="text-foreground">Career Journey</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Your AI-powered career coach. Get personalized insights, build
          standout resumes, ace interviews, and land your dream job — all in one
          intelligent platform.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <Button
            asChild
            size="lg"
            className="bg-violet-600 hover:bg-violet-700 text-white px-8 h-12 text-base font-semibold shadow-lg shadow-violet-500/25"
          >
            <Link href="/dashboard">
              Get Started Free
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 px-8 text-base font-semibold border-border/60"
          >
            <Link href="#features">See How It Works</Link>
          </Button>
        </div>

        {/* Feature cards */}
        <div
          id="features"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto"
        >
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative p-6 rounded-xl border border-border/60 bg-card/50 backdrop-blur-sm hover:border-violet-500/50 hover:bg-card/80 transition-all duration-300 text-left"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center mb-4 group-hover:bg-violet-500/20 transition-colors">
                <feature.icon className="w-5 h-5 text-violet-400" />
              </div>
              <h3 className="font-semibold text-sm mb-1.5">{feature.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}