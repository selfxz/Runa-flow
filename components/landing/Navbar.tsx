"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sobreOpen, setSobreOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (sobreOpen) {
      gsap.to(dropdownRef.current, { opacity: 1, visibility: "visible", y: 0, duration: 0.4, ease: "power3.out" });
    } else {
      gsap.to(dropdownRef.current, { opacity: 0, visibility: "hidden", y: -10, duration: 0.3, ease: "power3.in" });
    }
  }, { dependencies: [sobreOpen], scope: dropdownRef });

  useGSAP(() => {
    if (menuOpen) {
      gsap.fromTo(mobileMenuRef.current, 
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.5, ease: "expo.out" }
      );
    }
  }, { dependencies: [menuOpen], scope: mobileMenuRef });

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-[1200px] px-6">
      <div className="bg-black/60 backdrop-blur-xl border border-green-600/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] rounded-full px-8 py-3 flex items-center justify-between transition-all duration-500 hover:shadow-[0_12px_48px_rgba(0,0,0,0.4)]">
        
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <img 
            src="/images/logo_runaflow.png" 
            alt="Runa Flow Logo" 
            className="h-10 md:h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-105" 
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          <ul className="flex items-center gap-10 text-[13px] font-black uppercase tracking-[0.2em] text-white">
            <li>
              <Link href="/" className="relative group/link py-2">
                <span>Inicio</span>
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-orange-600 transition-all duration-300 group-hover/link:w-full" />
              </Link>
            </li>
            
            {/* Sobre nosotros Dropdown */}
            <li 
              className="relative group"
              onMouseEnter={() => setSobreOpen(true)}
              onMouseLeave={() => setSobreOpen(false)}
            >
              <button 
                onClick={() => setSobreOpen(!sobreOpen)}
                className="flex items-center gap-1 py-2 hover:text-green-500 transition-colors focus:outline-none"
              >
                Sobre nosotros <ChevronDown size={14} className={`transition-transform duration-300 ${sobreOpen ? 'rotate-180 text-green-500' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}
              <div 
                ref={dropdownRef}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-0 pt-4 w-56 opacity-0 invisible"
              >
                <div className="bg-black/95 backdrop-blur-2xl border border-green-600/10 shadow-2xl rounded-2xl py-2 overflow-hidden">
                  <Link href="/quienes-somos" onClick={() => setSobreOpen(false)} className="block px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-green-600/10 hover:text-green-500 transition-colors">Quiénes somos</Link>
                  <Link href="/nuestro-equipo" onClick={() => setSobreOpen(false)} className="block px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-green-600/10 hover:text-green-500 transition-colors">Nuestro equipo</Link>
                </div>
              </div>
            </li>

            <li>
              <Link href="/eventos" className="relative group/link py-2">
                <span>Eventos</span>
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-orange-600 transition-all duration-300 group-hover/link:w-full" />
              </Link>
            </li>
            <li>
              <Link href="/contactanos" className="relative group/link py-2">
                <span>Contáctanos</span>
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-green-500 transition-all duration-300 group-hover/link:w-full" />
              </Link>
            </li>
          </ul>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div 
        ref={mobileMenuRef}
        className={`md:hidden overflow-hidden ${menuOpen ? 'block' : 'hidden'}`}
      >
        <div className="bg-black/95 backdrop-blur-2xl border-t border-green-600/10 px-6 py-8 flex flex-col gap-6 text-white rounded-b-3xl mt-2">
          <Link href="/" onClick={() => setMenuOpen(false)} className="text-sm font-black uppercase tracking-widest">Inicio</Link>
          <div className="flex flex-col gap-4 pl-4 border-l-2 border-green-600/30">
             <Link href="/quienes-somos" onClick={() => setMenuOpen(false)} className="text-xs font-bold uppercase tracking-wider text-white/60">Quiénes somos</Link>
             <Link href="/nuestro-equipo" onClick={() => setMenuOpen(false)} className="text-xs font-bold uppercase tracking-wider text-white/60">Nuestro equipo</Link>
          </div>
          <Link href="/eventos" onClick={() => setMenuOpen(false)} className="text-sm font-black uppercase tracking-widest">Eventos</Link>
          <Link href="/warmiflow" onClick={() => setMenuOpen(false)} className="text-sm font-black uppercase tracking-widest bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">WarmiFlow</Link>
          <Link href="/contactanos" onClick={() => setMenuOpen(false)} className="text-sm font-black uppercase tracking-widest text-green-500">Contáctanos</Link>
        </div>
      </div>
    </nav>
  );
}