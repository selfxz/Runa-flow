"use client";
import { useState, useEffect } from "react";

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      // Wait for exit animation to finish before removing from DOM
      setTimeout(() => setVisible(false), 800);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-black transition-all duration-700 ease-in-out ${loading ? 'opacity-100' : 'opacity-0 pointer-events-none scale-110'}`}>
      <div className="relative flex flex-col items-center gap-8">
        {/* Animated Logo */}
        <div className="relative w-32 md:w-48 animate-in fade-in zoom-in duration-1000">
          <img 
            src="/images/logo_runaflow.png" 
            alt="Runa Flow" 
            className="w-full h-auto animate-pulse" 
          />
          {/* Subtle Glow behind logo */}
          <div className="absolute inset-0 bg-orange-600/20 blur-[60px] rounded-full animate-pulse" />
        </div>

        {/* Loading Bar */}
        <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
          <div className="absolute inset-0 bg-orange-600 animate-loading-bar" />
        </div>

        {/* Text */}
        <p className="text-[10px] font-black uppercase tracking-[0.8em] text-white/40 animate-pulse">
          Iniciando el Flujo
        </p>
      </div>

      <style jsx global>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-loading-bar {
          animation: loading-bar 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
