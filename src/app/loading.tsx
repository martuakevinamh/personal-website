export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative bg-[#0E0C0A]">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(201,162,39,0.07),transparent)]" />
      
      <div className="relative z-10 flex flex-col items-center">
        {/* Spinner */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-white/10" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-violet-500 animate-spin" />
        </div>

        {/* Text */}
        <p className="mt-8 text-stone-400 font-medium tracking-widest uppercase text-sm" aria-live="polite">
          Loading…
        </p>
      </div>
    </div>
  );
}
