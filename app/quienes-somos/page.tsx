"use client";
import React, { useRef } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import BackgroundAnimation from "@/components/landing/BackgroundAnimation";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export default function QuienesSomosPage() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ delay: 0.2 });

      tl.from(".reveal-text > *", {
        x: -100,
        opacity: 0,
        stagger: 0.2,
        duration: 1.2,
        ease: "power4.out",
      }).from(
        ".reveal-image",
        {
          x: 100,
          opacity: 0,
          scale: 1.1,
          duration: 1.5,
          ease: "expo.out",
        },
        "-=1",
      );
    },
    { scope: container },
  );

  return (
    <main className="min-h-screen bg-black text-white font-['Inter'] relative overflow-x-hidden flex flex-col">
      <BackgroundAnimation />
      <Navbar />

      <section
        ref={container}
        className="flex-1 flex items-center pt-32 lg:pt-20 pb-16 px-6 md:px-20 lg:px-32 relative z-10"
      >
        <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Left Side: Content */}
          <div className="lg:col-span-7 reveal-text space-y-10">
            <div className="space-y-6">
              <h3 className="text-[12px] font-black uppercase tracking-[0.6em] text-orange-600 ml-1">
                Nuestra Esencia
              </h3>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.85] italic flex flex-col">
                <span className="text-white">Rimaymi</span>
                <span className="text-orange-600">Kawsay</span>
                <span className="text-[1.5rem] md:text-3xl font-light tracking-widest text-white/60 mt-4 normal-case italic">
                  Nuestra voz es vida
                </span>
              </h1>
            </div>

            <div className="space-y-8 max-w-xl">
              <div className="w-16 h-1 bg-orange-600" />
              <div className="space-y-6">
                <p className="text-lg md:text-xl text-white/80 font-light leading-relaxed text-justify">
                  Polifonía Films es una productora audiovisual latinoamericana
                  dedicada a dar voz a expresiones culturales y narrativas
                  históricamente marginadas. Su enfoque actual destaca la
                  revalorización del Hip Hop como un pilar de identidad y
                  resistencia social, donde
                  <span className="text-white font-semibold italic">
                    {" "}
                    Runa Flow
                  </span>{" "}
                  no es solo una plataforma, es un movimiento cultural.
                </p>

                {/* --- NUEVO BLOQUE DE AGRADECIMIENTOS --- */}
                <div className="mt-8 border-l-2 border-white/20 pl-4 py-1">
                  <p className="text-xs md:text-sm text-white/50 font-light italic leading-relaxed text-justify">
                    Runaflow nació gracias al apoyo de muchas personas, queremos hacer una mención especial a <span className="text-white/70">"Melany Carhuinare, Rebeca Ruiz, Dante Centeno y Silvia Ormeño"</span> por haber apoyado a través de donaciones en el proyecto. Además, agradecemos el apoyo de los colectivos <span className="text-orange-500/80 font-medium">RAPBUCA</span> y <span className="text-orange-500/80 font-medium">CAMPO DE MARTE</span> que nos apoyaron con sus conocimientos y dejarnos grabar contenido.
                  </p>
                </div>
                {/* --------------------------------------- */}
                
              </div>
            </div>
          </div>

          {/* Right Side: Image */}
          <div className="lg:col-span-5 reveal-image relative">
            <div className="absolute -inset-4 border border-white/10 rounded-sm -z-10" />
            <div className="relative aspect-[3/4] lg:max-h-[55vh] overflow-hidden rounded-sm group shadow-[0_30px_80px_rgba(0,0,0,0.8)]">
              <img
                src="/esencia-runa.png"
                alt="Esencia Runa Flow"
                className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-110 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 w-full mt-auto">
        <Footer />
      </div>
    </main>
  );
}