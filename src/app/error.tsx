"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service if needed
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative bg-[#0a0a0f] px-6 text-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(239,68,68,0.05),transparent)]" />

      <div className="relative z-10 glass-card p-8 max-w-md w-full border-red-500/20">
        <div className="w-16 h-16 bg-red-500/10 text-red-500 flex items-center justify-center rounded-2xl mx-auto mb-6 text-3xl">
          ⚠️
        </div>
        <h2 className="text-2xl font-bold mb-3">Something went wrong!</h2>
        <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
          We encountered an error while loading the portfolio data. This might be a temporary network issue.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="w-full btn-primary bg-linear-to-r from-red-500 to-orange-500 shadow-red-500/20 hover:shadow-red-500/40 justify-center"
          >
            Try Again
          </button>
          <Link href="/" className="w-full btn-secondary justify-center">
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
