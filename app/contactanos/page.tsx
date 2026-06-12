"use client";
import React from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import BackgroundAnimation from "@/components/landing/BackgroundAnimation";
import ContactSection from "@/components/landing/ContactSection";

export default function ContactanosPage() {
  return (
    <main className="min-h-screen w-full bg-black relative font-['Inter'] flex flex-col overflow-hidden">
      <BackgroundAnimation />
      <Navbar />
      
      <div className="flex-1 flex flex-col justify-center px-6 relative z-10 w-full max-w-7xl mx-auto">
        <ContactSection />
      </div>
 
      <div className="relative z-10">
        <Footer />
      </div>
    </main>
  );
}
