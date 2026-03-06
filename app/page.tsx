"use client";

import { useState } from "react";
import Link from "next/link";
import { Link2, Network, Zap, CheckCircle2, FileCode, Lock, ChevronDown, ArrowRight, Brain, Clock, Search, Sparkles, Plus, Image as ImageIcon, FileText, Video } from "lucide-react";

export default function Home() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen grid-bg relative selection:bg-indigo-300">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b-4 border-black px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-indigo-600 border-2 border-black flex items-center justify-center rotate-[-3deg] group-hover:rotate-0 transition-transform">
              <Brain className="text-white w-6 h-6" />
            </div>
            <span className="font-black text-2xl uppercase tracking-tighter">Synapse</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="font-bold uppercase text-sm hover:underline decoration-4 underline-offset-4 decoration-indigo-600">Features</a>
            <a href="#how-it-works" className="font-bold uppercase text-sm hover:underline decoration-4 underline-offset-4 decoration-emerald-500">How it works</a>
            <a href="#faq" className="font-bold uppercase text-sm hover:underline decoration-4 underline-offset-4 decoration-rose-500">FAQ</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/signup" className="brut-button py-2 px-6 text-sm">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-32 md:py-48 flex flex-col items-center text-center">
        <div className="brut-badge mb-12 rotate-[-2deg]">Your Second Brain</div>
        <h1 className="heading-brut text-6xl md:text-8xl mb-8">
          CAPTURE <span className="text-indigo-600">EVERYTHING.</span> <br />
          SEARCH BY <span className="text-emerald-500 underline decoration-8 underline-offset-4">MEANING.</span>
        </h1>
        <p className="max-w-2xl text-xl md:text-2xl font-bold mb-12 leading-tight">
          Capture PDFs, notes, images, and videos as structured memories that are
          <span className="brut-highlight ml-1">automatically understood by Synapse.</span>
        </p>

      </section>

      {/* Multimodal Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 py-24">
        <h2 className="heading-brut text-4xl mb-16 text-center underline decoration-indigo-600 underline-offset-8">Capture Any Format</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: FileText, label: "PDFs & DOCS", color: "bg-indigo-500" },
            { icon: ImageIcon, label: "IMAGES & OCR", color: "bg-emerald-500" },
            { icon: Video, label: "VIDEO TRANSCRIPTS", color: "bg-rose-500" },
            { icon: Link2, label: "WEB ARTICLES", color: "bg-amber-400" }
          ].map((item, i) => (
            <div key={i} className="brut-card p-6 bg-white flex flex-col items-center gap-4 text-center">
              <div className={`w-16 h-16 ${item.color} border-2 border-black shadow-[4px_4px_0px_0px_black] flex items-center justify-center rotate-${i % 2 === 0 ? '[-2deg]' : '[2deg]'}`}>
                <item.icon className="text-white w-8 h-8" />
              </div>
              <span className="font-black uppercase text-sm">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Main Features */}
      <section id="features" className="bg-indigo-600 border-y-4 border-black py-24">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="heading-brut text-5xl md:text-7xl text-white mb-16 uppercase">Built for Power Users</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Link2, title: "Multimodal capture", desc: "Save PDFs, web articles, notes, screenshots, images, and videos into one place, tailored to its format." },
              { icon: Network, title: "Semantic understanding", desc: "Synapse automatically extracts text, reads handwriting, and transcribes video for smart tags." },
              { icon: Zap, title: "Natural language search", desc: "Ask questions in plain language—find quotes from photos or insights from long papers." },
              { icon: CheckCircle2, title: "Smart collections", desc: "Let Synapse auto-organize your memories around topics, projects, and research threads." },
              { icon: FileCode, title: "Memory-native views", desc: "Read articles in reader mode, browse image cards, or watch playable video memories." },
              { icon: Lock, title: "Private by design", desc: "Your second brain is yours alone—secure by default, with encryption and full export options." }
            ].map((f, i) => (
              <div key={i} className="brut-card p-8 bg-white group hover:bg-emerald-50 transition-colors">
                <div className="w-16 h-16 bg-white border-4 border-black flex items-center justify-center mb-6 group-hover:rotate-[10deg] transition-transform shadow-[4px_4px_0px_0px_black]">
                  <f.icon className="w-8 h-8 text-black" />
                </div>
                <h3 className="font-black text-2xl uppercase mb-4 leading-none">{f.title}</h3>
                <p className="font-bold text-gray-700 leading-snug">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 max-w-4xl mx-auto px-4">
        <h2 className="heading-brut text-5xl text-center mb-16 uppercase italic">Frequently Asked <span className="text-indigo-600">Questions</span></h2>
        <div className="space-y-6">
          {[
            {
              question: "What types of content can I save to Synapse?",
              answer: "You can capture PDFs, text notes, images, screenshots, and videos. Each item is automatically processed—text is extracted, handwriting is read, and video is transcribed."
            },
            {
              question: "How does semantic search work?",
              answer: "Instead of keyword matching, Synapse understands meaning. Ask questions in natural language like 'find that quote about productivity' and Synapse finds it based on context."
            },
            {
              question: "Are my memories private?",
              answer: "Yes. Your memories are encrypted and stored securely. We believe in privacy first—your second brain is yours alone, with full export options."
            }
          ].map((faq, i) => (
            <div key={i} className="brut-card overflow-hidden">
              <button
                onClick={() => toggleFaq(i)}
                className="w-full p-6 text-left flex justify-between items-center bg-white hover:bg-gray-50 transition-colors"
              >
                <span className="font-black text-xl uppercase">{faq.question}</span>
                <ChevronDown className={`w-8 h-8 transition-transform ${openFaqIndex === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === i && (
                <div className="p-6 border-t-4 border-black bg-emerald-50 font-bold">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-rose-500 border-y-4 border-black py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <h2 className="heading-brut text-6xl md:text-8xl text-white mb-8 uppercase">Build Your <br />Second Brain.</h2>
          <p className="text-white font-black text-2xl mb-12 uppercase tracking-wide">Start capturing memories from anywhere today.</p>
          <Link href="/signup" className="brut-button brut-button-secondary text-2xl px-12 py-6 rotate-[-1deg]">
            GET STARTED NOW
          </Link>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-20">
          <Brain size={400} className="text-white" />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-indigo-600 border-2 border-white flex items-center justify-center rotate-[-3deg]">
                <Brain className="text-white w-6 h-6" />
              </div>
              <span className="font-black text-2xl uppercase tracking-tighter">Synapse</span>
            </Link>
            <p className="font-bold text-gray-400 max-w-xs uppercase text-sm">Build your second brain today. Capture everything, find anything.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-12 uppercase text-xs font-black tracking-widest">
            <div className="flex flex-col gap-4">
              <span className="text-gray-500">Product</span>
              <a href="#features" className="hover:text-indigo-400 decoration-2 transition-all">Features</a>
              <Link href="/workflow" className="hover:text-emerald-400 transition-all">Workflow</Link>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-gray-500">Company</span>
              <Link href="/about" className="hover:text-rose-400 transition-all">About</Link>
              <Link href="/blog" className="hover:text-indigo-400 transition-all">Blog</Link>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-800 flex justify-between items-center text-xs font-bold text-gray-500">
          <span>© 2026 SYNAPSE CORP.</span>
          <span>REWIRING KNOWLEDGE.</span>
        </div>
      </footer>
    </div>
  );
}
