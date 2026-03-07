"use client";

import Link from "next/link";
import { Link2, Network, Zap, MessageSquare, FileCode, Puzzle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const FEATURES = [
  {
    icon: <Link2 />,
    title: "Neural Linking",
    desc: "Connect fragments of thought based on intent and context.",
    color: "bg-indigo-100",
  },
  {
    icon: <Network />,
    title: "Cognitive Engine",
    desc: "Autonomous categorization using LLM clusters.",
    color: "bg-emerald-100",
  },
  {
    icon: <Zap />,
    title: "Multimodal OCR",
    desc: "High-fidelity snapshots of your world in real-time.",
    color: "bg-rose-100",
  },
  {
    icon: <MessageSquare />,
    title: "Neural Chat",
    desc: "Infinite-context conversations with your entire integrated knowledge base.",
    color: "bg-amber-100",
  },
  {
    icon: <FileCode />,
    title: "MCP Gateway",
    desc: "Bridging your memory to any AI assistant via Model Context Protocol.",
    color: "bg-purple-100",
  },
  {
    icon: <Puzzle />,
    title: "Universal Extension",
    desc: "Zero-latency indexing for YouTube, PDFs, and deep-web research datasets.",
    color: "bg-blue-100",
  },
];

export default function FeaturesPage() {
  return (
    <div className="h-[100dvh] flex flex-col grid-bg overflow-hidden selection:bg-indigo-300">
      <Navbar />
      
      <main className="flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full px-6 py-8 overflow-hidden">
        <h1 className="heading-brut text-4xl md:text-7xl mt-12 mb-12 uppercase text-center italic">
          The <span className="text-indigo-600">Protocol</span> Stack.
        </h1>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 flex-1 content-center">
          {FEATURES.map((feature, i) => (
            <div 
              key={i}
              className={`brut-card p-4 md:p-8 ${feature.color} flex flex-col gap-4 border-2 border-black h-full justify-center transition-transform hover:scale-[1.02]`}
            >
              <div className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-black text-lg md:text-xl uppercase tracking-tighter mb-1">
                  {feature.title}
                </h3>
                <p className="font-bold text-gray-600 uppercase text-[9px] md:text-xs leading-tight tracking-widest">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
