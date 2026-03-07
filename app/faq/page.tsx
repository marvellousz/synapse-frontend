"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const FAQS = [
  {
    question: "What exactly is a 'Memory' in Synapse?",
    answer: "A Memory is any piece of digital knowledge—a PDF, a web snapshot, a video, or even a text snippet—that Synapse indexes into a high-dimensional vector space for instant semantic retrieval."
  },
  {
    question: "How do I integrate Synapse with Claude or Gemini?",
    answer: "Synapse uses the Model Context Protocol (MCP). Simply start the Synapse MCP server and point your AI assistant to the provided endpoint to start chatting with your integrated knowledge base."
  },
  {
    question: "How does the Synapse Extension accelerate research?",
    answer: "The Synapse Extension provides one-click 'Neural Snapshots' of any web page. It instantly extracts key insights, transcribes embedded media, and links the context to your global memory stack without leaving your active tab."
  },
  {
    question: "Does my data ever leave my machine?",
    answer: "Synapse operates on a privacy-first hybrid model. While your raw data and vector index are stored locally, we utilize secure, high-fidelity cognitive processing via Google Gemini for advanced extraction, summarization, and neural linking."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="h-[100dvh] flex flex-col grid-bg overflow-hidden selection:bg-indigo-300">
      <Navbar />
      
      <main className="flex-1 flex flex-col pt-20 md:pt-32 max-w-4xl mx-auto w-full px-6 py-8 overflow-y-auto">
        <h1 className="heading-brut text-4xl md:text-7xl mb-12 uppercase text-center italic">
          Most <span className="text-rose-500">Asked.</span>
        </h1>
        
        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <div
              key={index}
              className="brut-card bg-white border-2 border-black overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(index === openIndex ? null : index)}
                className="w-full p-4 md:p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg md:text-xl font-black uppercase tracking-tight">
                  {faq.question}
                </h3>
                <ChevronDown 
                  className={`w-6 h-6 flex-shrink-0 transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`}
                />
              </button>
              {openIndex === index && (
                <div className="px-4 md:px-6 pb-4 md:pb-6 border-t-2 border-black pt-4 md:pt-6">
                  <p className="font-bold text-gray-600 uppercase text-[10px] md:text-xs leading-relaxed tracking-widest">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
