"use client";
import React, { useRef, useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import BackgroundAnimation from "@/components/landing/BackgroundAnimation";
import Footer from "@/components/landing/Footer";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Calendar, MapPin, Info } from "lucide-react";

const eventFlyers = [
  { 
    id: 1, 
    title: "WARMIFLOW", 
    description: "Un espacio seguro para chicas que quieren transformar sus emociones en música. Aprende escritura, flow y expresión artística junto a Farrah en un taller donde tu voz será protagonista.", 
    date: "13 JUN 2026", 
    image: "/images/projects/warmilfow.png", 
    category: "TALLER"
  },
  { 
    id: 2, 
    title: "ROTONDA CYPHER", 
    description: "Espacio cultural dónde las personas podrán demostrar su habilidades con las rimas y flow, evento que cuenta con interludios culturales. Runaflow se junta con Rapbuca para hacer esto realidad, contaremos con música en vivo, premios y mucho más.", 
    date: "22 JUN 2026", 
    image: "/images/projects/rotonda.png", 
    category: "ROTONDA"
  },
  { 
    id: 3, 
    title: "KACHI CYPHER", 
    description: "¡Cypher en colaboración con Kachi Cachicha x One to One x Runaflow! El quechua y el español pueden combinarse de forma fascinante y lo compruebas con este Cypher.", 
    date: "-", 
    image: "/images/projects/kachicypher.jpg", 
    category: "CYPHER"
  },
];

export default function EventosPage() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Explicit animation to ensure they end up fully visible
    gsap.fromTo(".event-flyer-card", 
      { 
        y: 60, 
        opacity: 0, 
        scale: 0.9 
      }, 
      { 
        y: 0, 
        opacity: 1, 
        scale: 1, 
        stagger: 0.2, 
        duration: 1, 
        ease: "power3.out", 
        delay: 0.2
      }
    );
  }, { scope: container });

  return (
    <main className="min-h-screen w-full bg-black relative font-['Inter'] flex flex-col">
      <BackgroundAnimation />
      <Navbar />

      <section ref={container} className="relative z-10 w-full flex-1 px-6 md:px-16 lg:px-24 pt-32 pb-20 flex flex-col items-center justify-center">
        <div className="max-w-7xl w-full space-y-14 flex flex-col items-center">
          {/* Header */}
          <div className="space-y-4 text-center w-full">
            <h3 className="text-[11px] font-black uppercase tracking-[0.8em] text-green-500">Próximas Sesiones</h3>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none text-white">
              Flyers de <span className="text-orange-600">Eventos</span>
            </h1>
          </div>

          {/* Centered Grid with 3 Flyers */}
          <div className="flex flex-wrap justify-center gap-10 w-full">
            {eventFlyers.map((event) => (
              <div key={event.id} className="event-flyer-card opacity-0 group relative w-full sm:w-[320px] aspect-[3/4] overflow-hidden rounded-2xl cursor-pointer shadow-2xl transition-all duration-500 hover:-translate-y-2">
                
                {/* Image - Resetting brightness to be sure */}
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover transition-all duration-700 group-hover:grayscale group-hover:brightness-50 group-hover:scale-110" 
                />

                {/* Grayish Overlay */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-zinc-950/80 backdrop-blur-[4px] opacity-0 group-hover:opacity-100 transition-all duration-700" />

                {/* Category badge */}
                <div className="absolute top-4 left-4 z-20">
                  <span className="bg-green-600 text-white px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg shadow-lg group-hover:bg-orange-600 transition-colors">
                    {event.category}
                  </span>
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
                  <div className="space-y-4">
                    <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-tight leading-none text-white transition-all duration-500 group-hover:translate-y-[-160px] group-hover:text-orange-600 drop-shadow-lg">
                      {event.title}
                    </h3>
                    
                    {/* Hover Info */}
                    <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                             <Info size={14} className="text-green-500 shrink-0 mt-1" />
                             <p className="text-[11px] leading-relaxed italic text-white/80">
                               {event.description}
                             </p>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-white/10 space-y-2">
                          <div className="flex items-center gap-2 text-white/90">
                            <Calendar size={14} className="text-orange-500 shrink-0" />
                            <span className="text-[10px] font-bold tracking-wider">{event.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Animated Border */}
                <div className="absolute inset-0 border-2 border-white/0 group-hover:border-green-500/20 rounded-2xl transition-all duration-700" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="relative z-10"><Footer /></div>
    </main>
  );
}
