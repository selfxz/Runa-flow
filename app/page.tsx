"use client";
import React from "react";
import Navbar from "@/components/landing/Navbar";
import HeroVinyl from "@/components/landing/HeroVinyl";
import ArtistCharacters from "@/components/landing/ArtistCharacters";
import BackgroundAnimation from "@/components/landing/BackgroundAnimation";
import Footer from "@/components/landing/Footer";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export default function Home() {
  const container = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".hero-left", {
        x: -100,
        opacity: 0,
        duration: 1.5,
        ease: "power4.out",
        delay: 0.2,
      });
      gsap.from(".hero-right", {
        x: 100,
        opacity: 0,
        duration: 1.5,
        ease: "power4.out",
        delay: 0.4,
      });
    },
    { scope: container },
  );

  return (
    <main
      ref={container}
      className="min-h-screen w-full bg-black relative font-['Inter'] overflow-x-hidden flex flex-col"
    >
      {/* Dynamic Background */}
      <BackgroundAnimation />

      {/* Navigation */}
      <Navbar />

      {/* Hero & Artists Section - Now flex-1 to fill space */}
      <section className="relative z-10 w-full flex-1 flex flex-col xl:flex-row items-center justify-start xl:justify-between px-6 md:px-12 lg:px-20 pt-32 xl:pt-24 pb-12 xl:pb-0 gap-16 xl:gap-0">
        {/* Left Side (Disco) */}
        <div className="hero-left w-full xl:w-[40%] flex flex-col items-center xl:items-start justify-center relative">
          <div className="relative group scale-[0.6] sm:scale-[0.75] md:scale-[0.85] lg:scale-[0.9] xl:scale-[0.85] 2xl:scale-[1.1] transition-all duration-700">
            <div className="absolute inset-0 bg-green-600/10 blur-[80px] rounded-full scale-150 animate-pulse" />
            <HeroVinyl />
          </div>
        </div>

        {/* Right Side (Artistas) */}
        <div className="hero-right w-full xl:w-[60%] flex items-center justify-center overflow-visible">
          <div className="w-full h-full flex items-center justify-center">
            <ArtistCharacters />
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="relative z-10 w-full">
        <Footer />
      </div>
    </main>
  );
}
