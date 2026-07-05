"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { LayoutDashboard, User, Briefcase, FolderGit2, Zap, GraduationCap } from "lucide-react";
import toast from "react-hot-toast";

const IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const WARN_BEFORE_MS  =  1 * 60 * 1000; //  1 minute warning before logout

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const idleTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warnTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warnToastId = useRef<string | null>(null);

  const signOutIdle = useCallback(async () => {
    if (warnToastId.current) toast.dismiss(warnToastId.current);
    await supabase.auth.signOut();
    toast.error("You were signed out due to inactivity.", { duration: 5000 });
    router.replace("/admin/login");
  }, [router]);

  const resetIdleTimer = useCallback(() => {
    // Clear existing timers
    if (idleTimer.current)  clearTimeout(idleTimer.current);
    if (warnTimer.current)  clearTimeout(warnTimer.current);
    if (warnToastId.current) { toast.dismiss(warnToastId.current); warnToastId.current = null; }

    // Set warning 1 min before logout
    warnTimer.current = setTimeout(() => {
      warnToastId.current = toast("⚠️ You'll be signed out in 1 minute due to inactivity.", {
        duration: WARN_BEFORE_MS,
        icon: "⏰",
      });
    }, IDLE_TIMEOUT_MS - WARN_BEFORE_MS);

    // Set actual logout timer
    idleTimer.current = setTimeout(signOutIdle, IDLE_TIMEOUT_MS);
  }, [signOutIdle]);

  // Track any user activity on the page
  useEffect(() => {
    if (pathname === "/admin/login" || !session) return;

    const events = ["mousemove", "keydown", "mousedown", "touchstart", "scroll"];
    events.forEach((e) => window.addEventListener(e, resetIdleTimer, { passive: true }));
    resetIdleTimer(); // Start timer on mount

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetIdleTimer));
      if (idleTimer.current)  clearTimeout(idleTimer.current);
      if (warnTimer.current)  clearTimeout(warnTimer.current);
    };
  }, [pathname, session, resetIdleTimer]);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (!mounted) return;

      if (!data.session) {
        if (pathname !== "/admin/login") {
          router.replace("/admin/login");
        } else {
          setLoading(false);
        }
      } else {
        setSession(data.session);
        if (pathname === "/admin/login") {
          router.replace("/admin");
        } else {
          setLoading(false);
        }
      }
    };
    
    checkAuth();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      setSession(session);
      
      if (event === "SIGNED_OUT" && pathname !== "/admin/login") {
        router.replace("/admin/login");
      } else if (event === "SIGNED_IN" && pathname === "/admin/login") {
        router.replace("/admin");
      }
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0f]">
        <div className="w-10 h-10 border-4 border-zinc-800 border-t-violet-500 rounded-full animate-spin mb-4" />
        <span className="text-zinc-500 text-sm tracking-widest uppercase">Verifying Session...</span>
      </div>
    );
  }

  // Render without sidebar for login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Render with sidebar for protected pages
  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#0a0a0f] overflow-hidden text-zinc-200">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-[#12121a] z-50">
        <h2 className="text-xl font-bold bg-linear-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
          Admin Panel
        </h2>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-zinc-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        ${isMobileMenuOpen ? "flex" : "hidden"} 
        md:flex flex-col 
        w-full md:w-64 
        border-b md:border-b-0 md:border-r border-white/5 
        bg-[#12121a] 
        absolute md:relative 
        z-40 
        h-[calc(100vh-72px)] md:h-screen 
        top-18 md:top-0
      `}>
        <div className="hidden md:block p-6 border-b border-white/5">
          <h2 className="text-xl font-bold bg-linear-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            Admin Panel
          </h2>
          <p className="text-xs text-zinc-500 mt-1 truncate">{session?.user?.email}</p>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {[
            { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
            { name: "Personal Data", path: "/admin/personal", icon: <User size={20} /> },
            { name: "Education", path: "/admin/education", icon: <GraduationCap size={20} /> },
            { name: "Experiences", path: "/admin/experiences", icon: <Briefcase size={20} /> },
            { name: "Projects", path: "/admin/projects", icon: <FolderGit2 size={20} /> },
            { name: "Skills", path: "/admin/skills", icon: <Zap size={20} /> },
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => {
                router.push(item.path);
                setIsMobileMenuOpen(false); // Close menu on navigation
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                pathname === item.path
                  ? "bg-violet-500/10 text-violet-400 border border-violet-500/20"
                  : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
              }`}
            >
              <span className="shrink-0">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5">
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.replace("/");
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative bg-[#0a0a0f]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_0%,rgba(139,92,246,0.03),transparent)] pointer-events-none" />
        <div className="p-4 md:p-8 relative z-10">{children}</div>
      </main>
    </div>
  );
}
