"use client";
import React, { useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { artists } from "@/data/artists";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ArtistCharacters() {
  const container = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useGSAP(
    () => {
      // Solid & Sharp Entrance
      gsap.fromTo(
        ".artist-card",
        {
          y: 60,
          opacity: 0,
          scale: 0.95,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.1,
          duration: 1,
          ease: "power3.out",
        },
      );
    },
    { scope: container },
  );

  return (
    <div
      ref={container}
      className="w-full relative overflow-visible flex justify-center"
    >
      {/* Background Glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[300px] bg-orange-600/5 blur-[100px] rounded-full -z-10" />

      {/* Static Artist Row */}
      <div className="hidden xl:flex -space-x-14 2xl:-space-x-16 min-[1920px]:-space-x-20 min-[2560px]:-space-x-24 px-2 items-center justify-center overflow-visible">
        {artists.map((artist) => (
          <Link
            key={artist.id}
            href={`/artista/${artist.id}`}
            className="artist-card group relative flex-shrink-0 w-52 2xl:w-60 min-[1920px]:w-80 min-[2560px]:w-[26rem] transition-all duration-700 hover:z-50 opacity-0"
          >
            {/* Image Container */}
            <div className="relative h-[65vh] 2xl:h-[70vh] min-[1920px]:h-[75vh] min-[2560px]:h-[80vh] flex items-end justify-center overflow-visible transition-all duration-500 group-hover:-translate-y-4">
              <img
                src={artist.image}
                alt={artist.name}
                style={artist.imageStyle}
                className={`w-full h-full object-contain object-bottom grayscale brightness-75 group-hover:grayscale-0 group-hover:scale-110 group-hover:brightness-110 transition-all duration-700 ease-out drop-shadow-[0_20px_60px_rgba(0,0,0,0.8)] ${artist.imageClass || ""}`}
              />

              {/* Reflection / Shadow */}
              <div className="absolute bottom-0 w-[80%] h-16 bg-black/60 blur-3xl -z-10 group-hover:bg-orange-600/20 transition-all duration-1000" />
            </div>
          </Link>
        ))}
      </div>
      {/* Vista para Tablets/Móvil: Carrusel (Visible en < XL) */}
      <div className="xl:hidden flex flex-col items-center justify-center w-full px-6">
        <MobileCarousel />
      </div>
    </div>
  );
}

function MobileCarousel() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const nextArtist = React.useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % artists.length);
  }, []);

  const prevArtist = () => {
    setCurrentIndex((prev) => (prev - 1 + artists.length) % artists.length);
    resetAutoPlay();
  };

  const resetAutoPlay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(nextArtist, 4000);
  };

  useEffect(() => {
    autoPlayRef.current = setInterval(nextArtist, 4000);
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [nextArtist]);

  useGSAP(
    () => {
      gsap.fromTo(
        ".mobile-reveal",
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 1, ease: "power3.out" },
      );
    },
    { dependencies: [currentIndex], scope: carouselRef },
  );

  return (
    <div
      ref={carouselRef}
      className="relative w-full flex flex-col items-center pt-2"
    >
      <div className="relative w-full flex items-center justify-center min-h-[50vh] md:min-h-[60vh]">
        {/* Navigation - Glassmorphism style */}
        <button
          onClick={prevArtist}
          className="absolute left-0 z-40 p-4 bg-white/5 hover:bg-orange-600/20 rounded-full backdrop-blur-xl border border-white/10 text-white transition-all duration-500"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={() => {
            nextArtist();
            resetAutoPlay();
          }}
          className="absolute right-0 z-40 p-4 bg-white/5 hover:bg-orange-600/20 rounded-full backdrop-blur-xl border border-white/10 text-white transition-all duration-500"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        <div className="w-full flex justify-center items-center">
          {artists.map(
            (artist, index) =>
              index === currentIndex && (
                <Link
                  key={artist.id}
                  href={`/artista/${artist.id}`}
                  className="mobile-reveal flex flex-col items-center group"
                >
                  <div className="relative">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      style={artist.imageStyle}
                      className={`w-72 md:w-[450px] h-auto drop-shadow-[0_30px_60px_rgba(0,0,0,0.8)] transition-all duration-1000 group-hover:scale-105 ${artist.imageClass || ""}`}
                    />
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-32 h-6 bg-orange-600/10 blur-3xl -z-10" />
                  </div>

                  <h3 className="mt-12 text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-orange-600 drop-shadow-2xl">
                    {artist.name}
                  </h3>
                </Link>
              ),
          )}
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="flex gap-2 mt-12">
        {artists.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 transition-all duration-700 rounded-full ${index === currentIndex ? "w-16 bg-orange-600" : "w-4 bg-white/10"}`}
          />
        ))}
      </div>
    </div>
  );
}
