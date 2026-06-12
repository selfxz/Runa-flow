"use client";
import React from "react";
import Navbar from "@/components/landing/Navbar";
import TeamSection from "@/components/landing/TeamSection";
import Footer from "@/components/landing/Footer";
import BackgroundAnimation from "@/components/landing/BackgroundAnimation";

export default function NuestroEquipoPage() {
  return (
    <main className="min-h-screen bg-black text-white font-['Inter'] relative overflow-hidden">
      <BackgroundAnimation />
      <Navbar />
      
      <div className="pt-20 relative z-10">
        <TeamSection />
      </div>

      <Footer />
    </main>
  );
}
