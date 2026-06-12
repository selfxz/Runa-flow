"use client";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";



export default function HeroVinyl() {
  const router = useRouter();
  const vinylRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP({ scope: containerRef });

  // Continuous rotation
  useGSAP(() => {
    gsap.to(vinylRef.current, {
      rotation: 360,
      duration: 10,
      repeat: -1,
      ease: "none"
    });
  }, { scope: containerRef });

  const handleClick = () => {
    if (!containerRef.current) return;
    
    // Exit animation
    gsap.to(containerRef.current, {
      x: 300,
      opacity: 0,
      scale: 0.8,
      duration: 0.8,
      ease: "power3.inOut",
      onComplete: () => {
        router.push("/musical");
      }
    });
  };

  return (
    <div 
      ref={containerRef}
      onClick={handleClick}
      className="relative w-[280px] h-[280px] lg:w-[350px] lg:h-[350px] cursor-pointer z-40"
    >
      <div ref={vinylRef} className="relative w-full h-full group">
        {/* The Disc */}
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_50px_rgba(0,0,0,0.12)] relative z-10">
          {/* Main Disc Body */}
          <circle cx="100" cy="100" r="98" fill="#111" />
          
          {/* Grooves (More visible) */}
          {[90, 85, 80, 75, 70, 65, 60, 55, 50, 45, 40].map((r) => (
            <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="#1a1a1a" strokeWidth="0.5" />
          ))}

          {/* Reflections (These make rotation visible) */}
          <g className="opacity-20">
             <path d="M100 2 A 98 98 0 0 1 198 100 L 100 100 Z" fill="url(#shine)" />
             <path d="M100 198 A 98 98 0 0 1 2 100 L 100 100 Z" fill="url(#shine)" />
          </g>

          <defs>
            <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="white" stopOpacity="0.5" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Center Label (With details to show rotation) */}
          <circle cx="100" cy="100" r="32" fill="#39ff14" />
          <circle cx="100" cy="100" r="30" fill="none" stroke="#2db312" strokeWidth="1" />
          
          {/* Label Details (Text or patterns) */}
          <g transform="rotate(45 100 100)">
             <rect x="98" y="75" width="4" height="15" fill="#000" opacity="0.4" />
             <rect x="98" y="110" width="4" height="15" fill="#000" opacity="0.4" />
          </g>
          
          <circle cx="100" cy="100" r="5" fill="#fff" />
        </svg>
        
        {/* Glowing Indicator */}
        <div className="absolute inset-[-15px] rounded-full border border-green-400/0 group-hover:border-green-400/20 group-hover:scale-110 transition-all duration-700 -z-0 blur-sm" />
      </div>
    </div>
  );
}

