"use client";
import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";



export default function BackgroundAnimation({ hideImage = false }: { hideImage?: boolean } = {}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const blobs = gsap.utils.toArray<HTMLElement>(".blob");
    
    blobs.forEach((blob) => {
      gsap.to(blob, {
        x: "random(-100, 100)",
        y: "random(-100, 100)",
        duration: "random(10, 20)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-black">
      {/* Runaflow Background Image */}
      {!hideImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{ backgroundImage: "url('/images/fondoRunaflow.png')" }}
        />
      )}

      {/* Animated Blobs (Subtle on Dark) */}
      <div className="blob absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-orange-900/20 blur-[120px]" />
      <div className="blob absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-900/20 blur-[120px]" />
      <div className="blob absolute top-[20%] right-[10%] w-[40%] h-[50%] rounded-full bg-zinc-800/30 blur-[120px]" />
      <div className="blob absolute bottom-[20%] left-[10%] w-[40%] h-[40%] rounded-full bg-orange-900/10 blur-[120px]" />
      
      {/* Texture Overlay (Steel/Concrete) */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')]" />
    </div>
  );
}

