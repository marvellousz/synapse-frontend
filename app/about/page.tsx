"use client";

import Link from "next/link";
import { Brain, Shield, Network, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PILLARS = [
  { icon: <Brain />, title: "Cognitive Recall", desc: "High-dimensional vector indexing turns scattered data into instant knowledge.", color: "bg-indigo-100" },
  { icon: <Shield />, title: "Hybrid Privacy", desc: "Local-first storage meets secure Google Gemini processing for private AI.", color: "bg-emerald-100" },
  { icon: <Network />, title: "MCP Ecosystem", desc: "Bridge your brain to any AI assistant via Model Context Protocol.", color: "bg-rose-100" },
  { icon: <Zap />, title: "Neural Snapshots", desc: "Capture research from PDFs, YouTube, and datasets with zero-latency extraction.", color: "bg-amber-100" },
];

export default function AboutPage() {
  return (
    <div className="h-[100dvh] flex flex-col grid-bg overflow-hidden selection:bg-indigo-300">
      <Navbar />

      <main className="flex-1 flex flex-col justify-center max-w-6xl mx-auto w-full px-6 py-8">
        <h1 className="heading-brut text-4xl md:text-7xl mb-12 uppercase italic text-center">
          Building the <span className="text-indigo-600">Second Brain.</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {PILLARS.map((p, i) => (
            <div key={i} className={`brut-card p-6 ${p.color} border-2 border-black flex items-start gap-6`}>
              <div className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center shrink-0">
                {p.icon}
              </div>
              <div>
                <h3 className="heading-brut text-2xl mb-1">{p.title}</h3>
                <p className="font-bold text-gray-600 uppercase text-[10px] leading-relaxed tracking-widest">
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-8 bg-black text-white border-4 border-black shadow-[8px_8px_0px_0px_#4F46E5] flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="font-black uppercase text-xl italic">Ready to rethink how you know?</p>
          <Link href="/signup" className="brut-button bg-white text-black px-10 py-4 font-black">
            JOIN NOW
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
