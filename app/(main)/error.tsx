"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="border-destructive/30 bg-destructive/5 max-w-md w-full">
        <CardContent className="pt-8 pb-8 flex flex-col items-center text-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-destructive" />
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {error.message || "An unexpected error occurred while loading this page."}
            </p>
          </div>

          <div className="flex gap-3 flex-wrap justify-center">
            <Button
              onClick={reset}
              size="sm"
              className="gap-2 bg-violet-600 hover:bg-violet-700 text-white"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Try Again
            </Button>
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link href="/dashboard">
                <ArrowLeft className="w-3.5 h-3.5" />
                Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}