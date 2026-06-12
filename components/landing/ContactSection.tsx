"use client";
import React, { useState, useRef } from "react";
import { Send, Mail, User, FileText, CheckCircle } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

export default function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSent(true);
        setTimeout(() => {
          if (successRef.current) {
            gsap.fromTo(successRef.current,
              { scale: 0.9, opacity: 0 },
              { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.5)" }
            );
          }
        }, 50);
      } else {
        throw new Error(result.error || "Error al enviar el formulario.");
      }
    } catch (err) {
      console.error("Error al enviar email:", err);
      const msg = err instanceof Error ? err.message : "No se pudo enviar el mensaje. Inténtalo de nuevo.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out", duration: 1.2 } });
    
    tl.from(".animate-left", {
      y: 20,
      opacity: 0,
      stagger: 0.1,
      delay: 0.1
    })
    .from(".animate-right", {
      y: 20,
      opacity: 0,
      duration: 1.2
    }, "-=1");
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center py-2 md:py-4">
      
      <div className="w-full flex flex-col lg:flex-row items-center lg:items-center justify-between gap-6 sm:gap-8 xl:gap-16 relative z-10">
        
        {/* Left Side: Text */}
        <div className="animate-left w-full lg:w-[40%] flex flex-col items-center lg:items-start space-y-3 sm:space-y-4 md:space-y-6">
          
          <div className="inline-block px-5 sm:px-8 py-2 sm:py-3 border-2 border-green-500 rounded-xl bg-green-500/5 transition-all hover:border-green-500 group">
            <h3 className="text-[10px] sm:text-xs md:text-lg font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-green-500 italic group-hover:scale-105 transition-transform">
              Contáctanos
            </h3>
          </div>
 
          <div className="space-y-2 sm:space-y-3 md:space-y-4 text-center lg:text-left relative">
            <div className="absolute -left-4 top-0 w-1.5 h-full bg-orange-600 rounded-full hidden lg:block" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black uppercase italic leading-[0.85] text-white tracking-tighter">
              Hagamos <br /> <span className="text-green-500">Música</span>
            </h2>
            <p className="text-white/40 text-xs sm:text-sm md:text-lg font-medium italic leading-relaxed max-w-xs md:max-w-sm mx-auto lg:mx-0">
              ¿Tienes una propuesta? <br />
              <span className="text-white/80">Escríbenos y hagamos fluir la esencia.</span>
            </p>
          </div>
 
          <div className="hidden lg:block w-32 h-[2px] bg-gradient-to-r from-green-500 to-transparent opacity-30" />
        </div>
 
        {/* Right Side: Form */}
        <div className="animate-right w-full lg:w-[55%] xl:w-[50%] relative">
          <div className="absolute -inset-4 bg-green-600/5 blur-[100px] rounded-full -z-10" />
          
          <form onSubmit={handleSubmit} 
            className="bg-zinc-900/40 backdrop-blur-3xl border-2 border-white/5 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] p-4 sm:p-6 md:p-10 xl:p-12 shadow-2xl relative overflow-hidden group hover:border-green-500/20 transition-all duration-500">
            
            {/* Form Background Pattern */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')]" />

            {/* Success Overlay */}
            {sent && (
              <div 
                ref={successRef}
                className="absolute inset-0 bg-black/95 backdrop-blur-xl z-20 flex flex-col items-center justify-center p-4 sm:p-8 text-center"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 via-transparent to-transparent pointer-events-none" />
                
                <div className="relative z-10 space-y-4 sm:space-y-6 max-w-sm">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping opacity-75" />
                    <div className="absolute -inset-2 rounded-full border border-green-500/20" />
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-green-500 to-emerald-600 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                      <CheckCircle size={28} className="text-white" />
                    </div>
                  </div>

                  <div className="space-y-1 sm:space-y-2">
                    <h4 className="text-xl sm:text-2xl md:text-3xl font-black uppercase italic tracking-tight text-white leading-none">
                      ¡Mensaje Enviado!
                    </h4>
                    <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-green-500 italic">
                      Enviado con éxito
                    </p>
                  </div>

                  <p className="text-white/40 text-[11px] sm:text-xs leading-relaxed italic px-2">
                    Tu mensaje ha sido enviado directamente a <span className="text-white/80 font-semibold">{CONTACT_EMAIL}</span>. Te responderemos pronto.
                  </p>

                  <button 
                    type="button"
                    onClick={() => {
                      setSent(false);
                      setName("");
                      setEmail("");
                      setMessage("");
                    }}
                    className="px-6 sm:px-8 py-2 sm:py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-green-500/30 text-white rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest italic transition-all active:scale-95"
                  >
                    Volver a Escribir
                  </button>
                </div>
              </div>
            )}

            {/* Email badge */}
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 relative z-10">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                <Mail size={12} className="text-green-500 sm:w-[14px] sm:h-[14px]" />
              </div>
              <div className="min-w-0">
                <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white/30 italic">Correo de destino</p>
                <span className="text-green-400 text-xs sm:text-sm font-bold truncate block">{CONTACT_EMAIL}</span>
              </div>
            </div>
 
            {/* Form Fields */}
            <div className="space-y-3 sm:space-y-4 md:space-y-5 relative z-10">
              {/* Name & Email Row - side by side on md+ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="relative">
                  <label className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-green-500 mb-1 sm:mb-1.5 block pl-2 italic">Nombre</label>
                  <div className="relative group/input">
                    <User size={13} className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-green-500 transition-colors" />
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                      placeholder="Tu nombre" required disabled={isSubmitting}
                      className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl pl-9 sm:pl-12 pr-4 sm:pr-6 py-2.5 sm:py-3 md:py-4 text-white text-xs md:text-sm font-medium outline-none placeholder:text-white/10 focus:border-green-500/40 focus:bg-white/[0.08] transition-all disabled:opacity-50" />
                  </div>
                </div>

                <div className="relative">
                  <label className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-green-500 mb-1 sm:mb-1.5 block pl-2 italic">Tu Correo</label>
                  <div className="relative group/input">
                    <Mail size={13} className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-green-500 transition-colors" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@correo.com" required disabled={isSubmitting}
                      className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl pl-9 sm:pl-12 pr-4 sm:pr-6 py-2.5 sm:py-3 md:py-4 text-white text-xs md:text-sm font-medium outline-none placeholder:text-white/10 focus:border-green-500/40 focus:bg-white/[0.08] transition-all disabled:opacity-50" />
                  </div>
                </div>
              </div>
 
              {/* Message */}
              <div className="relative">
                <label className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-green-500 mb-1 sm:mb-1.5 block pl-2 italic">Mensaje</label>
                <div className="relative group/input">
                  <FileText size={13} className="absolute left-3 sm:left-5 top-4 sm:top-5 text-white/20 group-focus-within/input:text-green-500 transition-colors" />
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)}
                    placeholder="¿De qué quieres hablarnos?" required disabled={isSubmitting}
                    className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl pl-9 sm:pl-12 pr-4 sm:pr-6 py-4 sm:py-5 md:py-6 text-white text-xs md:text-sm font-medium outline-none resize-none h-24 sm:h-28 md:h-36 placeholder:text-white/10 focus:border-green-500/40 focus:bg-white/[0.08] transition-all disabled:opacity-50" />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-600/10 border-2 border-red-600/20 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-red-400 text-[11px] sm:text-xs font-semibold italic text-center">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button type="submit" disabled={isSubmitting}
                className="w-full py-3 sm:py-4 md:py-5 bg-gradient-to-r from-orange-600 to-green-600 text-white rounded-xl md:rounded-2xl font-black uppercase italic tracking-[0.2em] sm:tracking-[0.3em] text-[11px] sm:text-xs md:text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)] sm:shadow-[0_15px_40px_rgba(0,0,0,0.6)] flex items-center justify-center gap-2 sm:gap-3 group/btn disabled:opacity-50 disabled:cursor-not-allowed">
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send size={14} className="sm:w-4 sm:h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" /> 
                    Enviar Mensaje
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
