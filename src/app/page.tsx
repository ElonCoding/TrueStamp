"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Workflow from "@/components/Workflow";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
      {/* Global Background Effects */}
      <div className="fixed inset-0 z-[-1] bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
      
      <Navbar />
      
      <div className="flex-grow pt-16">
        <Hero />
        <Stats />
        <Workflow />
        <Features />
      </div>
      
      <Footer />
    </main>
  );
}
