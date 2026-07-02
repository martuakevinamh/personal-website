export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative bg-[#0a0a0f]">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(139,92,246,0.06),transparent)]" />
      
      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Rings */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-[3px] border-zinc-800" />
          <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-violet-500 border-r-fuchsia-500 animate-spin" />
          <div
            className="absolute inset-2 rounded-full border-[3px] border-transparent border-b-cyan-400 border-l-blue-500 animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          />
        </div>

        {/* Text */}
        <div className="mt-8 flex items-center gap-2">
          <span className="text-zinc-400 font-medium tracking-widest uppercase text-sm animate-pulse">
            Loading Interface
          </span>
          <span className="flex gap-1">
            <span className="w-1 h-1 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1 h-1 bg-fuchsia-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1 h-1 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </span>
        </div>
      </div>
    </div>
  );
}
