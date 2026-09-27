"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { supabase } from "@/utils/supabase";

export default function RegisterPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading) {
      const ctx = gsap.context(() => {
        gsap.from(".register-panel", {
          y: 50,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        });
      }, containerRef);
      return () => ctx.revert();
    }
  }, [loading, user]);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/register`,
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, write to Supabase `registrations` table here.
    // For now, we simulate success as per ground rule 4.
    setSubmitted(true);
  };

  if (loading) return <div className="min-h-screen bg-[#050505]" />;

  return (
    <div ref={containerRef} className="min-h-screen pt-32 pb-24 px-6 md:px-12 flex items-center justify-center relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="register-panel w-full max-w-lg glass p-10 md:p-14 rounded-sm relative z-10 border-t-4 border-t-red-600">
        <div className="text-center mb-10">
          <h1 className="font-display text-5xl uppercase text-white mb-2">Join the <span className="text-red-500">Roster</span></h1>
          <p className="font-sans text-gray-400 font-light">
            Secure your spot at the GeeksForGeeks Spider-Verse event.
          </p>
        </div>

        {!user ? (
          <div className="flex flex-col items-center">
            <button 
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-4 py-4 px-6 bg-white text-black font-semibold rounded-sm hover:bg-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Sign in with Google
            </button>
            <p className="mt-6 text-sm text-gray-500 text-center">
              Authentication is required to register. We only use Google OAuth.
            </p>
          </div>
        ) : submitted ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/50">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="font-display text-4xl text-white mb-2">Registration Confirmed</h3>
            <p className="text-gray-400">Welcome to the Spider-Verse, {user.user_metadata.full_name || 'Hero'}.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
              <input 
                type="text" 
                defaultValue={user.user_metadata.full_name || ""}
                required
                className="w-full bg-black/50 border border-white/20 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
              <input 
                type="email" 
                defaultValue={user.email || ""}
                disabled
                className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-gray-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">College / Section</label>
              <input 
                type="text" 
                required
                placeholder="e.g. B.Tech CSE, Section A"
                className="w-full bg-black/50 border border-white/20 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
            <button 
              type="submit"
              className="w-full mt-4 py-4 bg-red-600 text-white font-display text-2xl uppercase tracking-widest hover:bg-red-700 transition-colors rounded-sm"
            >
              Complete Registration
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
