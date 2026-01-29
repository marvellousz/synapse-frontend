"use client";

import PixelBlast from "@/components/PixelBlast";
import { Link2, Network, Zap, CheckCircle2, FileCode, Lock } from "lucide-react";

export default function Home() {
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

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b backdrop-blur-sm" style={{ borderColor: "rgba(148, 163, 184, 0.1)", backgroundColor: "rgba(15, 23, 42, 0.8)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img 
              src="/synapse.png" 
              alt="Synapse" 
              className="h-8 w-auto"
            />
            <span className="font-semibold text-lg" style={{ color: "#FFFFFF" }}>Synapse</span>
          </div>
          <div className="flex gap-8 items-center">
            <a href="#features" className="text-sm transition-colors hover:text-white" style={{ color: "#CBD5E1" }}>Features</a>
            <a href="#faq" className="text-sm transition-colors hover:text-white" style={{ color: "#CBD5E1" }}>FAQ</a>
            <button 
              className="px-6 py-2 rounded-lg font-medium text-sm transition-all hover:opacity-90"
              style={{ 
                background: "#3B82F6",
                color: "#FFFFFF"
              }}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        className="relative max-w-7xl mx-auto px-6 overflow-hidden flex items-center"
        style={{ 
          minHeight: 'calc(100vh - 80px)',
          position: 'relative'
        }}
      >
        <div className="max-w-2xl relative z-10 w-full glass-soft rounded-3xl px-8 py-10 border border-transparent">
          <h1 
            className="instrument-serif text-5xl md:text-6xl font-bold mb-6 leading-tight"
            style={{ color: "#F8FAFC" }}
          >
            Your multimodal second brain
          </h1>
          <p 
            className="text-lg md:text-xl mb-8 leading-relaxed"
            style={{ color: "#94A3B8" }}
          >
            Synapse lets you capture PDFs, notes, images, screenshots, and videos as structured memories that are automatically understood, summarized, and made searchable by meaning—so you can always find the exact idea, quote, or insight you saved, no matter where it came from.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              className="px-8 py-3 rounded-lg font-medium transition-all transform hover:scale-105 hover:opacity-90"
              style={{ 
                background: "#3B82F6",
                color: "#FFFFFF"
              }}
            >
              Start Free Trial
            </button>
            <button 
              className="px-8 py-3 rounded-lg font-medium border transition-colors hover:bg-white/5"
              style={{ 
                color: "#FFFFFF",
                borderColor: "#64748B"
              }}
            >
              View Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative max-w-7xl mx-auto px-6 py-32 border-t" style={{ borderColor: "rgba(148, 163, 184, 0.12)" }}>
        <h2 
          className="instrument-serif text-4xl font-bold mb-16"
          style={{ color: "#FFFFFF" }}
        >
          Designed for Power Users
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div 
            className="glass-surface p-6 rounded-3xl border transition-all hover:-translate-y-1 hover:shadow-2xl hover:border-primary/60"
          >
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
              style={{ background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)", color: "#FFFFFF" }}
            >
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
            className="glass-surface p-6 rounded-3xl border transition-all hover:-translate-y-1 hover:shadow-2xl hover:border-primary/60"
          >
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
              style={{ background: "linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)", color: "#FFFFFF" }}
            >
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
            className="glass-surface p-6 rounded-3xl border transition-all hover:-translate-y-1 hover:shadow-2xl hover:border-primary/60"
          >
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
              style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)", color: "#FFFFFF" }}
            >
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
            className="glass-surface p-6 rounded-3xl border transition-all hover:-translate-y-1 hover:shadow-2xl hover:border-primary/60"
          >
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
              style={{ background: "#10B981", color: "#FFFFFF" }}
            >
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
            className="glass-surface p-6 rounded-3xl border transition-all hover:-translate-y-1 hover:shadow-2xl hover:border-primary/60"
          >
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
              style={{ background: "linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)", color: "#FFFFFF" }}
            >
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
            className="glass-surface p-6 rounded-3xl border transition-all hover:-translate-y-1 hover:shadow-2xl hover:border-primary/60"
          >
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
              style={{ background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)", color: "#FFFFFF" }}
            >
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
      <section id="faq" className="relative max-w-4xl mx-auto px-6 py-32 border-t" style={{ borderColor: "rgba(148, 163, 184, 0.12)" }}>
        <h2 
          className="instrument-serif text-4xl font-bold mb-4 text-center"
          style={{ color: "#FFFFFF" }}
        >
          Frequently Asked Questions
        </h2>
        <p className="text-lg mb-16 text-center" style={{ color: "#CBD5E1" }}>
          Everything you need to know about Synapse
        </p>
        <div className="space-y-4">
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
              className="glass-soft p-6 rounded-3xl border transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              <h3 className="text-lg font-semibold mb-3" style={{ color: "#FFFFFF" }}>
                {faq.question}
              </h3>
              <p className="leading-relaxed" style={{ color: "#CBD5E1" }}>
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative max-w-7xl mx-auto px-6 py-32 border-t" style={{ borderColor: "rgba(148, 163, 184, 0.12)" }}>
        <div 
          className="glass-surface rounded-3xl p-16 text-center border"
        >
          <h2 
            className="instrument-serif text-4xl font-bold mb-4"
            style={{ color: "#FFFFFF" }}
          >
            Build your second brain today
          </h2>
          <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: "#E2E8F0" }}>
              Start capturing memories from anywhere—PDFs, notes, images, videos. Let Synapse understand, organize, and make everything searchable by meaning. Your knowledge, amplified.
          </p>
          <button 
            className="px-8 py-3 rounded-lg font-medium transition-all transform hover:scale-105 hover:opacity-90"
            style={{ 
              background: "#3B82F6",
              color: "#FFFFFF"
            }}
          >
            Start Building Your Second Brain
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t" style={{ borderColor: "rgba(148, 163, 184, 0.1)" }}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4" style={{ color: "#FFFFFF" }}>Product</h4>
              <ul className="space-y-2">
                {["Features", "FAQ", "Capture Flow", "Privacy"].map((item) => (
                  <li key={item}><a href="#" style={{ color: "#CBD5E1" }} className="hover:text-white transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4" style={{ color: "#FFFFFF" }}>Company</h4>
              <ul className="space-y-2">
                {["About", "Blog", "Careers", "Contact"].map((item) => (
                  <li key={item}><a href="#" style={{ color: "#CBD5E1" }} className="hover:text-white transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4" style={{ color: "#FFFFFF" }}>Resources</h4>
              <ul className="space-y-2">
                {["Documentation", "Guides", "API", "Support"].map((item) => (
                  <li key={item}><a href="#" style={{ color: "#CBD5E1" }} className="hover:text-white transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4" style={{ color: "#FFFFFF" }}>Legal</h4>
              <ul className="space-y-2">
                {["Privacy", "Terms", "Data Export", "Security"].map((item) => (
                  <li key={item}><a href="#" style={{ color: "#CBD5E1" }} className="hover:text-white transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t pt-8" style={{ borderColor: "rgba(148, 163, 184, 0.1)" }}>
            <p style={{ color: "#CBD5E1" }}>© 2026 Synapse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
