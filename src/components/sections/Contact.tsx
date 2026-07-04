"use client";

import React, { useState } from "react";
import { MapPin, Mail, CheckCircle2 } from "lucide-react";

type PersonalInfo = {
  name?: string | null;
  location?: string | null;
  email?: string | null;
  github_url?: string | null;
  linkedin_url?: string | null;
  instagram_url?: string | null;
};

function GithubIcon() {
  return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" /></svg>;
}
function LinkedinIcon() {
  return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0H5C2.239 0 0 2.239 0 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5V5c0-2.761-2.238-5-5-5zM8 19H5V8h3v11zM6.5 6.732a1.751 1.751 0 110-3.502 1.751 1.751 0 010 3.502zM20 19h-3v-5.604c0-3.368-4-3.113-4 0V19h-3V8h3v1.765c1.396-2.586 7-2.777 7 2.476V19z" /></svg>;
}
function InstagramIcon() {
  return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>;
}

const CONTACT_ITEMS = (info: PersonalInfo) => [
  info.location && { icon: <MapPin size={24} />, label: "Location", value: info.location, href: null },
  info.email    && { icon: <Mail size={24} />, label: "Email",    value: info.email,    href: `mailto:${info.email}` },
].filter(Boolean) as { icon: React.ReactNode; label: string; value: string; href: string | null }[];

export default function Contact({ personalInfo }: { personalInfo?: PersonalInfo | null }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const [emailError, setEmailError] = useState<string | null>(null);

  const ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ID
    ? `https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_ID}`
    : "https://formspree.io/f/mlgggvap";

  // Basic regex — catches obvious invalid formats before hitting any API
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const validateEmail = async (email: string): Promise<string | null> => {
    if (!EMAIL_REGEX.test(email)) return "Please enter a valid email address.";

    // Check that the domain has real MX records (no fake domains like test@abc.xyz)
    try {
      const res = await fetch(
        `https://emailvalidation.abstractapi.com/v1/?api_key=${process.env.NEXT_PUBLIC_ABSTRACT_EMAIL_KEY}&email=${encodeURIComponent(email)}`
      );
      if (res.ok) {
        const data = await res.json();
        // deliverability: "DELIVERABLE" | "UNDELIVERABLE" | "RISKY" | "UNKNOWN"
        if (data.deliverability === "UNDELIVERABLE") {
          return "This email address doesn't appear to exist. Please use a real email.";
        }
      }
    } catch {
      // If API is unavailable, let it through — don't block legitimate users
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);

    // Trim & enforce max lengths to prevent oversized payloads
    const name = form.name.trim().slice(0, 100);
    const email = form.email.trim().slice(0, 254);
    const message = form.message.trim().slice(0, 2000);

    if (!name || !email || !message) return;

    setStatus("sending");

    // Validate email before sending
    const emailErr = await validateEmail(email);
    if (emailErr) {
      setEmailError(emailErr);
      setStatus("idle");
      return;
    }

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      setStatus(res.ok ? "sent" : "error");
      if (res.ok) {
        setForm({ name: "", email: "", message: "" });
        setTimeout(() => setStatus("idle"), 5000);
      }
    } catch {
      setStatus("error");
    }
  };

  const socials = [
    { url: personalInfo?.github_url,    icon: <GithubIcon />,    label: "GitHub" },
    { url: personalInfo?.linkedin_url,  icon: <LinkedinIcon />,  label: "LinkedIn" },
    { url: personalInfo?.instagram_url, icon: <InstagramIcon />, label: "Instagram" },
  ].filter((s) => s.url);

  const contactItems = CONTACT_ITEMS(personalInfo ?? {});

  return (
    <section id="contact" className="py-28 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(99,102,241,0.05),transparent)]" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <h2 className="section-title">
          <span className="gradient-text">Get In Touch</span>
        </h2>
        <p className="section-subtitle">
          Have a question or want to work together? Feel free to reach out!
        </p>

        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* ── Left: Info ── */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-3">Let&apos;s Connect</h3>
              <p className="text-zinc-400 leading-relaxed">
                I&apos;m always open to discussing new projects, creative ideas, or
                opportunities to be part of something amazing. My inbox is always open.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-3">
              {contactItems.map(({ icon, label, value, href }) => (
                <div key={label} className="glass-card p-4 flex items-center gap-4 hover:border-violet-500/20 transition-all">
                  <div className="w-11 h-11 rounded-xl glass flex items-center justify-center text-xl shrink-0">
                    {icon}
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 mb-0.5">{label}</div>
                    {href ? (
                      <a href={href} className="font-medium text-sm hover:text-violet-400 transition-colors">
                        {value}
                      </a>
                    ) : (
                      <div className="font-medium text-sm">{value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            {socials.length > 0 && (
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Find me on</p>
                <div className="flex gap-3">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="w-12 h-12 rounded-xl glass flex items-center justify-center text-zinc-400 hover:text-white hover:border-violet-500/40 hover:bg-violet-500/10 hover:shadow-[0_0_20px_rgba(139,92,246,0.25)] transition-all duration-300"
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Right: Form ── */}
          <div className="glass-card p-8">
            {status === "sent" ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 mx-auto mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                <p className="text-zinc-400">Thank you! I&apos;ll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                  <label htmlFor="contact-name" className="text-sm font-medium text-zinc-300">
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-field"
                    placeholder="Your name"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="contact-email" className="text-sm font-medium text-zinc-300">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => { setForm({ ...form, email: e.target.value }); setEmailError(null); }}
                    className={`input-field ${emailError ? "border-red-500/60 focus:ring-red-500/30" : ""}`}
                    placeholder="your@email.com"
                  />
                  {emailError && (
                    <p className="text-xs text-red-400 mt-1">{emailError}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label htmlFor="contact-message" className="text-sm font-medium text-zinc-300">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="input-field resize-none"
                    placeholder="Your message..."
                  />
                </div>

                {status === "error" && (
                  <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                    Failed to send. Please try again.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full btn-primary justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === "sending" ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending…
                    </>
                  ) : (
                    <>
                      Send Message
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
