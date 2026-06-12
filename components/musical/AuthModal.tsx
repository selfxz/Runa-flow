"use client";
import React, { useState } from "react";
import { X, Mail, Lock, UserPlus, LogIn, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, authMode, setAuthMode, login, register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setIsAuthModalOpen(false);
    setError("");
    setSuccessMsg("");
    setEmail("");
    setPassword("");
    setFullName("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setIsSubmitting(true);
    (async () => {
      if (authMode === "register") {
        const result = await register(email, password, fullName);
        if (!result.success) {
          setError(result.error || "Error desconocido");
        } else {
          setSuccessMsg("¡Registro exitoso! Por favor inicia sesión.");
          setAuthMode("login");
          setPassword("");
          setFullName("");
        }
      } else {
        const result = await login(email, password);
        if (!result.success) {
          setError(result.error || "Error desconocido");
        } else {
          setEmail("");
          setPassword("");
          handleClose();
          window.location.reload();
        }
      }
      setIsSubmitting(false);
    })();
  };

  const switchMode = () => {
    setAuthMode(authMode === "login" ? "register" : "login");
    setError("");
    setSuccessMsg("");
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-3xl animate-in fade-in duration-500" 
        onClick={handleClose} 
      />
      
      <div className="relative w-full max-w-[90%] sm:max-w-md animate-modal-in group">
        {/* Glow behind the modal */}
        <div className="absolute -inset-4 bg-gradient-to-r from-orange-600/10 to-green-600/10 rounded-[3rem] blur-2xl group-hover:opacity-100 transition-opacity duration-500 opacity-50" />
        
        <div className="relative bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 sm:p-10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-y-auto max-h-[85vh] sm:max-h-[90vh] custom-scrollbar">
          
          {/* Top Decorative Line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[3px] bg-gradient-to-r from-transparent via-green-500 to-transparent z-20" />
          
          <button onClick={handleClose}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all hover:rotate-90 duration-300 z-20">
            <X size={18} />
          </button>

          <div className="text-center mb-6 sm:mb-10">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-[1rem] sm:rounded-[1.5rem] bg-gradient-to-br from-orange-600 to-green-600 flex items-center justify-center shadow-[0_10px_30px_rgba(234,88,12,0.3)] group-hover:scale-110 transition-transform duration-500">
              {authMode === "register" ? <UserPlus className="text-white w-5 h-5 sm:w-7 sm:h-7" /> : <LogIn className="text-white w-5 h-5 sm:w-7 sm:h-7" />}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tighter text-white">
              {authMode === "register" ? "Registro" : "Entrar"}
            </h2>
            <p className="text-white/40 text-[9px] sm:text-[10px] mt-2 font-bold uppercase tracking-[0.3em] italic">
              {authMode === "register" ? "Únete al universo Runa Flow" : "Bienvenido de vuelta, Guerrero"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Full Name - ONLY FOR REGISTER */}
            {authMode === "register" && (
              <div className="space-y-1.5 sm:space-y-2 group animate-entrance-up" style={{ animationDelay: '100ms' }}>
                <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.5em] text-white/30 pl-3 sm:pl-4 italic group-focus-within:text-green-500 transition-colors">Nombre Completo</label>
                <div className="relative group/field">
                  <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/field:text-green-500 transition-colors">
                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="TU NOMBRE"
                    required
                    className="w-full bg-white/5 border-2 border-white/5 rounded-2xl py-3.5 sm:py-4 pl-12 pr-4 sm:pl-14 sm:pr-6 text-white placeholder:text-white/40 focus:outline-none focus:border-green-500/50 focus:bg-white/10 transition-all text-xs sm:text-sm font-medium tracking-tight"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.5em] text-white/30 pl-3 sm:pl-4 italic">Tu Correo</label>
              <div className="relative group/input">
                <Mail className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-green-500 transition-colors w-4 h-4 sm:w-4 sm:h-4" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@ejemplo.com" required
                  className="w-full bg-white/5 border-2 border-white/5 rounded-2xl pl-12 pr-4 sm:pl-14 sm:pr-6 py-3.5 sm:py-4 text-white text-xs sm:text-sm font-medium outline-none placeholder:text-white/40 focus:border-green-500/30 focus:bg-white/[0.08] transition-all" />
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.5em] text-white/30 pl-3 sm:pl-4 italic">Contraseña</label>
              <div className="relative group/input">
                <Lock className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-orange-600 transition-colors w-4 h-4 sm:w-4 sm:h-4" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" required
                  className="w-full bg-white/5 border-2 border-white/5 rounded-2xl pl-12 pr-4 sm:pl-14 sm:pr-6 py-3.5 sm:py-4 text-white text-xs sm:text-sm font-medium outline-none placeholder:text-white/40 focus:border-orange-600/30 focus:bg-white/[0.08] transition-all" />
              </div>
            </div>

            {error && (
              <div className="bg-red-600/10 border-2 border-red-600/20 rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3 text-red-400 text-[10px] sm:text-xs font-black italic text-center animate-shake uppercase tracking-widest leading-relaxed">{error}</div>
            )}

            {successMsg && (
              <div className="bg-green-600/10 border-2 border-green-600/20 rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3 text-green-400 text-[10px] sm:text-xs font-black italic text-center animate-fade-in uppercase tracking-widest leading-relaxed">{successMsg}</div>
            )}

            <button type="submit" disabled={isSubmitting}
              className="relative w-full py-4 sm:py-5 bg-gradient-to-r from-orange-600 to-green-600 text-white rounded-2xl font-black uppercase italic tracking-[0.2em] text-xs sm:text-sm hover:shadow-[0_0_40px_rgba(34,197,94,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 overflow-hidden group/btn">
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
              {isSubmitting ? (
                <div className="w-5 h-5 sm:w-6 sm:h-6 border-3 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
              ) : (
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  {authMode === "register" ? <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" /> : <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />}
                  <span>{authMode === "register" ? "Crear Cuenta" : "Acceder"}</span>
                </div>
              )}
              {/* Shine effect */}
              <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] group-hover/btn:animate-shine" />
            </button>
          </form>

          <div className="mt-8 sm:mt-10 text-center relative z-10">
            <p className="text-white/40 text-xs font-medium">
              {authMode === "register" ? "¿Ya eres parte?" : "¿Eres nuevo aquí?"}{" "}
              <button onClick={switchMode} className="text-white hover:text-green-500 font-black transition-all uppercase tracking-widest ml-2 border-b border-white/20 hover:border-green-500">
                {authMode === "register" ? "Entrar" : "Unirme"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
