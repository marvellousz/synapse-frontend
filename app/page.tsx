"use client";

import { useState } from "react";
import Link from "next/link";
import PixelBlast from "@/components/PixelBlast";
import { Link2, Network, Zap, CheckCircle2, FileCode, Lock, ChevronDown } from "lucide-react";

export default function Home() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen relative">
      {/* Full-page PixelBlast Background */}
      <div 
        className="fixed inset-0 -z-10"
        style={{ 
          width: '100vw',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#0F172A'
        }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 opacity-40">
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <PixelBlast
              variant="square"
              pixelSize={4}
              color="#3B82F6"
              patternScale={2}
              patternDensity={1}
              enableRipples
              rippleSpeed={0.35}
              rippleThickness={0.12}
              rippleIntensityScale={1.2}
              liquid={false}
              speed={0.45}
              edgeFade={0.35}
              transparent={true}
            />
          </div>
        </div>
      </div>

      {/* Navigation - matches AppNav shape & theme */}
      <nav
        className="sticky top-0 z-50 rounded-b-2xl mx-4 mt-2 mb-0 shadow-lg"
        style={{
          background: "linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)",
          border: "1px solid rgba(59, 130, 246, 0.15)",
          borderTop: "none",
          boxShadow: "0 8px 32px rgba(15, 23, 42, 0.6), 0 1px 0 rgba(148, 163, 184, 0.08)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group rounded-xl px-2 py-1.5 -ml-2 transition-colors hover:bg-white/5">
            <img src="/synapse.jpg" alt="Synapse" className="h-9 w-auto rounded-lg ring-1 ring-white/10 transition-transform group-hover:scale-105" />
            <span className="font-semibold text-xl tracking-tight" style={{ color: "#F8FAFC" }}>Synapse</span>
          </Link>
          <div className="flex items-center gap-1">
            <a href="#features" className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-white/5" style={{ color: "#94A3B8" }}>Features</a>
            <a href="#faq" className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-white/5" style={{ color: "#94A3B8" }}>FAQ</a>
            <div className="w-px h-6 mx-1" style={{ backgroundColor: "rgba(148, 163, 184, 0.25)" }} />
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:opacity-95 hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)", color: "#FFFFFF", boxShadow: "0 4px 14px rgba(59, 130, 246, 0.4)" }}
            >
              Log in
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative max-w-6xl mx-auto px-6 overflow-hidden flex items-center" style={{ minHeight: "calc(100vh - 100px)", position: "relative" }}>
        <div
          className="max-w-2xl relative z-10 w-full rounded-3xl px-10 py-12"
          style={{
            background: "linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.85) 100%)",
            border: "1px solid rgba(59, 130, 246, 0.2)",
            boxShadow: "0 24px 48px rgba(15, 23, 42, 0.5), 0 0 0 1px rgba(148, 163, 184, 0.08)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
          }}
        >
          <h1 className="instrument-serif text-5xl md:text-6xl font-bold mb-6 leading-tight" style={{ color: "#F8FAFC" }}>
            Your multimodal second brain
          </h1>
          <p className="text-lg md:text-xl mb-10 leading-relaxed" style={{ color: "#94A3B8" }}>
            Synapse lets you capture PDFs, notes, images, screenshots, and videos as structured memories that are automatically understood, summarized, and made searchable by meaning—so you can always find the exact idea, quote, or insight you saved, no matter where it came from.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/signup"
              className="px-8 py-3.5 rounded-xl font-semibold transition-all hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] text-center"
              style={{ background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)", color: "#FFFFFF", boxShadow: "0 4px 20px rgba(59, 130, 246, 0.4)" }}
            >
              Get Started
            </Link>
            <Link
              href="/memories"
              className="px-8 py-3.5 rounded-xl font-medium border transition-all hover:bg-white/5 text-center"
              style={{ color: "#F8FAFC", borderColor: "rgba(148, 163, 184, 0.4)" }}
            >
              View Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative max-w-6xl mx-auto px-6 py-24">
        <h2 className="instrument-serif text-4xl md:text-5xl font-bold mb-4" style={{ color: "#F8FAFC" }}>
          Designed for Power Users
        </h2>
        <p className="text-lg mb-16 max-w-2xl" style={{ color: "#94A3B8" }}>
          Capture, understand, and search everything in one place.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div
            className="p-6 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
            style={{
              background: "linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)",
              borderColor: "rgba(59, 130, 246, 0.15)",
              boxShadow: "0 4px 24px rgba(15, 23, 42, 0.4)",
            }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)", color: "#FFFFFF" }}>
              <Link2 className="w-6 h-6" strokeWidth={2} />
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: "#FFFFFF" }}>
              Multimodal capture
            </h3>
            <p style={{ color: "#CBD5E1" }}>
              Save PDFs, web articles, notes, screenshots, images, and videos into one place, with each item presented in a view that’s tailored to its format.
            </p>
          </div>

          {/* Feature 2 */}
          <div
            className="p-6 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
            style={{
              background: "linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)",
              borderColor: "rgba(59, 130, 246, 0.15)",
              boxShadow: "0 4px 24px rgba(15, 23, 42, 0.4)",
            }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: "linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)", color: "#FFFFFF" }}>
              <Network className="w-6 h-6" strokeWidth={2} />
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: "#FFFFFF" }}>
              Semantic understanding
            </h3>
            <p style={{ color: "#CBD5E1" }}>
              Synapse automatically extracts text, reads handwriting, and transcribes video so your memories are structured, summarized, and enriched with smart tags.
            </p>
          </div>

          {/* Feature 3 */}
          <div
            className="p-6 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
            style={{
              background: "linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)",
              borderColor: "rgba(59, 130, 246, 0.15)",
              boxShadow: "0 4px 24px rgba(15, 23, 42, 0.4)",
            }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)", color: "#FFFFFF" }}>
              <Zap className="w-6 h-6" strokeWidth={2} />
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: "#FFFFFF" }}>
              Natural language search
            </h3>
            <p style={{ color: "#CBD5E1" }}>
              Ask questions in plain language—find a quote from a photo of your notebook, recall insights from a long paper, or surface products you saved months ago.
            </p>
          </div>

          {/* Feature 4 */}
          <div
            className="p-6 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
            style={{
              background: "linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)",
              borderColor: "rgba(59, 130, 246, 0.15)",
              boxShadow: "0 4px 24px rgba(15, 23, 42, 0.4)",
            }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: "#10B981", color: "#FFFFFF" }}>
              <CheckCircle2 className="w-6 h-6" strokeWidth={2} />
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: "#FFFFFF" }}>
              Smart collections
            </h3>
            <p style={{ color: "#CBD5E1" }}>
              Let Synapse auto-organize your memories around the topics, projects, and research threads you care about—no manual foldering required.
            </p>
          </div>

          {/* Feature 5 */}
          <div
            className="p-6 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
            style={{
              background: "linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)",
              borderColor: "rgba(59, 130, 246, 0.15)",
              boxShadow: "0 4px 24px rgba(15, 23, 42, 0.4)",
            }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: "linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)", color: "#FFFFFF" }}>
              <FileCode className="w-6 h-6" strokeWidth={2} />
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: "#FFFFFF" }}>
              Memory-native views
            </h3>
            <p style={{ color: "#CBD5E1" }}>
              Read articles in clean reader mode, browse images as visual cards, watch playable video memories, and work with tasks and notes in structured views.
            </p>
          </div>

          {/* Feature 6 */}
          <div
            className="p-6 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
            style={{
              background: "linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)",
              borderColor: "rgba(59, 130, 246, 0.15)",
              boxShadow: "0 4px 24px rgba(15, 23, 42, 0.4)",
            }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)", color: "#FFFFFF" }}>
              <Lock className="w-6 h-6" strokeWidth={2} />
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: "#FFFFFF" }}>
              Private by design
            </h3>
            <p style={{ color: "#CBD5E1" }}>
              Your second brain is yours alone—secure by default, with encryption and export options so you’re always in control of your knowledge.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative max-w-4xl mx-auto px-6 py-24">
        <h2 className="instrument-serif text-4xl md:text-5xl font-bold mb-4 text-center" style={{ color: "#F8FAFC" }}>
          Frequently Asked Questions
        </h2>
        <p className="text-lg mb-12 text-center max-w-xl mx-auto" style={{ color: "#94A3B8" }}>
          Everything you need to know about Synapse
        </p>
        <div className="space-y-3">
          {[
            {
              question: "What types of content can I save to Synapse?",
              answer: "You can capture PDFs, text notes, images, screenshots, and videos into Synapse. Each item is automatically processed—text is extracted from documents, handwriting is read from images, video content is transcribed, and everything is structured as searchable memories."
            },
            {
              question: "How does semantic search work?",
              answer: "Instead of keyword matching, Synapse understands meaning. Ask questions in natural language like 'find that quote about productivity from my notebook photo' or 'show me insights from research papers on AI'—Synapse will find the relevant memories based on what you're actually looking for, not just exact word matches."
            },
            {
              question: "What are smart collections?",
              answer: "Smart collections automatically organize your memories around ongoing interests, projects, and research threads. As you save content, Synapse groups related items together based on topics, themes, and context—no manual organizing required."
            },
            {
              question: "How does the browser capture flow work?",
              answer: "With our browser extension, you can save articles, images, and videos directly from any webpage with one click. Synapse captures the content, extracts the text, and creates a memory that's immediately searchable and organized."
            },
            {
              question: "Can I search handwritten notes from photos?",
              answer: "Yes! Synapse uses OCR and handwriting recognition to extract text from images of handwritten notes. Once processed, you can search for specific quotes, ideas, or concepts from your notebook photos just like you would search typed text."
            },
            {
              question: "What does 'conversational search' mean?",
              answer: "You can chat with your brain—ask questions in natural language and get answers from your saved memories. For example, 'What did I save about machine learning last month?' or 'Find products I was interested in buying'—Synapse understands context and meaning, not just keywords."
            },
            {
              question: "How is my data stored and secured?",
              answer: "Your memories are encrypted and stored securely. Synapse is designed with privacy first—your second brain is yours alone. You can export all your data at any time, and we never access your content without your permission."
            },
            {
              question: "Can I export my memories?",
              answer: "Absolutely. You own all your memories and can export them in various formats at any time. We believe in data portability—your knowledge should never be locked in."
            }
          ].map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl border overflow-hidden transition-all duration-200 hover:shadow-lg"
              style={{
                background: "linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.7) 100%)",
                borderColor: openFaqIndex === index ? "rgba(59, 130, 246, 0.25)" : "rgba(148, 163, 184, 0.15)",
                boxShadow: "0 4px 20px rgba(15, 23, 42, 0.3)",
              }}
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full p-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors rounded-2xl"
              >
                <h3 className="text-base font-semibold pr-4" style={{ color: "#F8FAFC" }}>
                  {faq.question}
                </h3>
                <ChevronDown className={`w-5 h-5 shrink-0 transition-transform duration-200 ${openFaqIndex === index ? "rotate-180" : ""}`} style={{ color: "#94A3B8" }} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                <p className="px-5 pb-5 pt-0 leading-relaxed" style={{ color: "#CBD5E1" }}>
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative max-w-6xl mx-auto px-6 py-24">
        <div
          className="rounded-3xl p-12 md:p-16 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)",
            border: "1px solid rgba(59, 130, 246, 0.2)",
            boxShadow: "0 24px 48px rgba(15, 23, 42, 0.5), 0 0 0 1px rgba(148, 163, 184, 0.08)",
          }}
        >
          <h2 className="instrument-serif text-4xl md:text-5xl font-bold mb-4" style={{ color: "#F8FAFC" }}>
            Build your second brain today
          </h2>
          <p className="text-lg mb-10 max-w-xl mx-auto leading-relaxed" style={{ color: "#94A3B8" }}>
            Start capturing memories from anywhere—PDFs, notes, images, videos. Let Synapse understand, organize, and make everything searchable by meaning. Your knowledge, amplified.
          </p>
          <Link
            href="/signup"
            className="inline-block px-10 py-3.5 rounded-xl font-semibold transition-all hover:opacity-95 hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)", color: "#FFFFFF", boxShadow: "0 4px 20px rgba(59, 130, 246, 0.4)" }}
          >
            Start Building Your Second Brain
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="relative rounded-t-2xl mx-4 mt-0 mb-2"
        style={{
          background: "linear-gradient(180deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%)",
          border: "1px solid rgba(59, 130, 246, 0.1)",
          borderBottom: "none",
          boxShadow: "0 -4px 24px rgba(15, 23, 42, 0.4)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider" style={{ color: "#94A3B8" }}>Product</h4>
              <ul className="space-y-2.5">
                {["Features", "FAQ", "Capture Flow", "Privacy"].map((item) => (
                  <li key={item}><a href={item === "Features" ? "#features" : item === "FAQ" ? "#faq" : "#"} style={{ color: "#CBD5E1" }} className="text-sm hover:text-white transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider" style={{ color: "#94A3B8" }}>Company</h4>
              <ul className="space-y-2.5">
                {["About", "Blog", "Careers", "Contact"].map((item) => (
                  <li key={item}><a href="#" style={{ color: "#CBD5E1" }} className="text-sm hover:text-white transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider" style={{ color: "#94A3B8" }}>Resources</h4>
              <ul className="space-y-2.5">
                {["Documentation", "Guides", "API", "Support"].map((item) => (
                  <li key={item}><a href="#" style={{ color: "#CBD5E1" }} className="text-sm hover:text-white transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider" style={{ color: "#94A3B8" }}>Legal</h4>
              <ul className="space-y-2.5">
                {["Privacy", "Terms", "Data Export", "Security"].map((item) => (
                  <li key={item}><a href="#" style={{ color: "#CBD5E1" }} className="text-sm hover:text-white transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t" style={{ borderColor: "rgba(148, 163, 184, 0.15)" }}>
            <p className="text-sm" style={{ color: "#94A3B8" }}>© 2026 Synapse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
