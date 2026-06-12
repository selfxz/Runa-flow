"use client";
import React, { useRef, use } from "react";
import Link from "next/link";
import { artists } from "@/data/artists";
import { notFound } from "next/navigation";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import { User, Mic2, Briefcase, GraduationCap, Share2 } from "lucide-react";

const InstagramIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const YoutubeIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

const TikTokIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.89-.44-4.2-.97-.06 2.07-.01 4.13-.02 6.19-.07 4.03-2.22 8.08-6.52 9.07-3.15.82-6.85-.29-8.7-2.91-1.68-2.32-1.63-5.83-.02-8.1 1.55-2.26 4.31-3.4 6.99-3.11V10.2c-1.33-.18-2.73.12-3.79.97-1.42 1.13-1.84 3.19-1.07 4.81.7 1.59 2.5 2.58 4.21 2.3 1.83-.2 3.2-1.95 3.14-3.79V.02z"/>
  </svg>
);

const getSocialIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'instagram': return <InstagramIcon />;
    case 'youtube': return <YoutubeIcon />;
    case 'tiktok': return <TikTokIcon size={22} />;
    default: return <Share2 size={24} />;
  }
};

interface Props {
  params: Promise<{ id: string }>;
}

export default function ArtistaPage({ params }: Props) {
  const { id } = use(params);
  const artist = artists.find((a) => a.id === id);
  const container = useRef<HTMLDivElement>(null);

  if (!artist) notFound();

  // Split name for the design: First part large, Second part smaller
  const nameParts = artist.name.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ");

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.fromTo(".bg-overlay", 
      {
        opacity: 0,
        scale: 1.15,
        filter: "brightness(0) blur(20px)"
      },
      {
        opacity: 1,
        scale: 1,
        filter: "brightness(0.4) grayscale(40%)",
        duration: 2.5,
        ease: "power3.out"
      }
    )
    .from(".artist-name-part", {
      x: -100,
      opacity: 0,
      stagger: 0.2,
      duration: 1.2,
      ease: "expo.out"
    }, "-=1")
    .from(".divider", {
      scaleX: 0,
      transformOrigin: "left",
      duration: 0.8,
      ease: "power3.inOut"
    }, "-=0.8")
    .from(".artist-bio", {
      y: 20,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    }, "-=0.6")
    .from(".project-card", {
      y: 50,
      opacity: 0,
      stagger: 0.1,
      duration: 1,
      ease: "power4.out"
    }, "-=0.8");
  }, { scope: container });

  return (
    <div ref={container} className="min-h-screen flex flex-col text-white relative overflow-x-hidden">
      <Navbar />

      {/* Background Image with Overlay */}
      <div 
        className="bg-overlay fixed inset-0 bg-cover bg-center z-0"
        style={{ 
          backgroundImage: `url('${artist.bgImage}')`,
          filter: 'brightness(0.4) grayscale(40%)'
        }}
      />
      
      {/* Main Content Overlay - Using flex-1 to fill space between Header and Footer */}
      <main className="relative flex-1 pt-32 md:pt-40 pb-20 px-6 md:px-20 flex flex-col justify-center z-10">
        
        <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center">
          
          {/* Left Column: Name and Bio */}
          <div className="lg:col-span-6 space-y-10">
            <div className="space-y-2">
               <div className="divider w-20 h-1 bg-orange-600 mb-8" />
               <h1 className="artist-name-part text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-white">
                 {firstName}
               </h1>
               <h2 className="artist-name-part text-3xl md:text-5xl font-black uppercase tracking-widest text-orange-600 italic">
                 {lastName}
               </h2>
            </div>
            
            <div className="space-y-6">
              <p className="artist-bio text-lg md:text-xl leading-relaxed text-white/80 max-w-xl font-light">
                {artist.bio}
              </p>
              <div className="artist-bio flex gap-8 pt-6">
                {artist.socials.map(s => (
                  <a 
                    key={s.platform} 
                    href={s.url} 
                    target="_blank" 
                    className="text-orange-600 hover:text-white transition-all duration-500 hover:scale-125 transform"
                    title={s.platform}
                  >
                    {getSocialIcon(s.platform)}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Projects/Chapters */}
          <div className="lg:col-span-6 flex flex-wrap lg:flex-nowrap gap-6 justify-center lg:justify-end">
            {artist.projects.slice(0, 3).map((project, index) => (
              <a 
                key={project.title}
                href={project.url}
                className="project-card relative group w-full sm:w-[260px] aspect-[4/5] overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/50 backdrop-blur-sm"
              >
                {/* Project Image Placeholder */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent z-10 opacity-80 group-hover:opacity-60 transition-opacity duration-700" />
                <img 
                  src={project.cover || "/images/artist_test.png"} 
                  alt={project.title}
                  className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-110 group-hover:scale-110 transition-all duration-1000"
                />
                
                {/* Chapter Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 px-4 z-20">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 group-hover:text-orange-600 transition-colors">
                    Capítulo 0{index + 1}
                  </span>
                  <span className="text-xs font-black uppercase tracking-[0.2em] mt-2 group-hover:scale-110 transition-transform">
                    {project.title}
                  </span>
                  {project.description && (
                    <p className="text-[10px] text-white/50 text-center mt-3 leading-relaxed max-w-[200px] opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                      {project.description}
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="max-w-[1400px] mx-auto w-full mt-24 flex flex-col items-center">
           <Link
              href="/"
              className="group px-12 py-4 border border-white/20 hover:border-orange-600 transition-all text-[10px] font-black uppercase tracking-[0.5em] relative overflow-hidden"
           >
              <span className="relative z-10 group-hover:text-white">REGRESAR AL INICIO</span>
              <div className="absolute inset-0 bg-orange-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
           </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}