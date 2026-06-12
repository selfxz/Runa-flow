"use client";
import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function EssenceSection() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top 70%",
      }
    });

    tl.from(".essence-text > *", {
      x: -100,
      opacity: 0,
      stagger: 0.2,
      duration: 1,
      ease: "power4.out"
    })
    .from(".essence-image", {
      x: 100,
      opacity: 0,
      scale: 1.1,
      duration: 1.5,
      ease: "expo.out"
    }, "-=1");
  }, { scope: container });

  return (
    <section ref={container} className="py-32 px-10 md:px-20 bg-black overflow-hidden relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-orange-600/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Side: Content */}
        <div className="lg:col-span-6 essence-text space-y-10">
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.6em] text-orange-600">
              Nuestra Esencia
            </h3>
            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] italic text-white">
              Redefiniendo <br />
              <span className="text-white/90">el flujo de la</span> <br />
              música andina
            </h2>
          </div>

          <div className="space-y-6 max-w-xl">
             <div className="w-20 h-[2px] bg-white/20" />
             <p className="text-lg text-white/70 leading-relaxed font-light text-justify">
               Somos un colectivo dedicado a potenciar el talento emergente y consolidado de nuestra región, 
               fusionando la tradición con las corrientes más vanguardistas del sonido global. 
               <span className="text-white font-bold"> Runa Flow</span> no es solo una plataforma, es un movimiento cultural que busca trascender fronteras a través del arte y la identidad.
             </p>
             <p className="text-sm text-white/40 leading-relaxed italic">
               Desde nuestras raíces, proyectamos una visión de futuro donde la música andina ocupa un lugar central en la escena contemporánea, rompiendo estigmas y creando nuevos lenguajes sonoros.
             </p>
          </div>
        </div>

        {/* Right Side: Image */}
        <div className="lg:col-span-6 essence-image relative">
           <div className="absolute -inset-4 border border-white/5 rounded-sm -z-10" />
           <div className="relative aspect-[4/5] overflow-hidden rounded-sm group">
              <img 
                src="/essence_futuristic_andean_1778119594427.png" 
                alt="Esencia Runa Flow" 
                className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000 scale-105 group-hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
              
              {/* Decorative elements */}
              <div className="absolute bottom-6 right-6 flex flex-col items-end">
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Established</span>
                 <span className="text-xs font-black text-white italic">MMXXIV</span>
              </div>
           </div>
        </div>

      </div>
    </section>
  );
}
