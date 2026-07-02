"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { LayoutDashboard, User, Briefcase, FolderGit2, Zap, GraduationCap } from "lucide-react";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();
  const pathname = usePathname();

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
    <div className="flex h-screen bg-[#0a0a0f] overflow-hidden text-zinc-200">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#12121a] flex flex-col">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-xl font-bold bg-linear-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            Admin Panel
          </h2>
          <p className="text-xs text-zinc-500 mt-1 truncate">{session?.user?.email}</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
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
              onClick={() => router.push(item.path)}
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
        <div className="p-8 relative z-10">{children}</div>
      </main>
    </div>
  );
}
