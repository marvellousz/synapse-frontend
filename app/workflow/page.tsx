"use client";

import { Zap, Search, Layers, Database } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const STEPS = [
  {
    num: "01",
    icon: <Layers className="w-8 h-8 text-indigo-600" />,
    title: "Capture",
    desc: "Synapse consumes PDFs, snapshots, and videos in real-time.",
    color: "bg-indigo-50"
  },
  {
    num: "02",
    icon: <Database className="w-8 h-8 text-emerald-600" />,
    title: "Link",
    desc: "Content is broken down into high-dimensional vectors.",
    color: "bg-emerald-50"
  },
  {
    num: "03",
    icon: <Search className="w-8 h-8 text-rose-600" />,
    title: "Retrieve",
    desc: "Search by intent, not just keywords. Find exact moments.",
    color: "bg-rose-50"
  }
];

export default function WorkflowPage() {
  return (
    <div className="h-[100dvh] flex flex-col grid-bg overflow-hidden selection:bg-indigo-300">
      <Navbar />

      <main className="flex-1 flex flex-col justify-center max-w-6xl mx-auto w-full px-6 py-8">
        <h1 className="heading-brut text-4xl md:text-7xl mb-12 uppercase italic text-center">
          The <span className="text-emerald-500">Synapse</span> Protocol.
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((step) => (
            <div key={step.num} className={`brut-card p-8 ${step.color} border-4 border-black relative`}>
              <div className="absolute top-0 right-0 py-2 px-6 bg-black text-white font-black text-xs uppercase">Step {step.num}</div>
              <div className="w-16 h-16 bg-white border-2 border-black flex items-center justify-center mb-6">
                {step.icon}
              </div>
              <h2 className="heading-brut text-3xl mb-4">{step.title}</h2>
              <p className="font-bold text-gray-600 leading-relaxed uppercase text-[10px] tracking-[0.15em]">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
}
