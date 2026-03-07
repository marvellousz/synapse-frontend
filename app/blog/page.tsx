"use client";

import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const POSTS = [
  {
    id: 1,
    title: "Personal Knowledge",
    excerpt: "Exploring how semantic indexing is changing the way we interact with our notes.",
    date: "MAR 01, 2026",
    category: "RESEARCH",
    color: "bg-indigo-50"
  },
  {
    id: 2,
    title: "OCR Beyond Logic",
    excerpt: "How Synapse reads between the lines of your messy whiteboard snapshots.",
    date: "FEB 24, 2026",
    category: "ENGINEERING",
    color: "bg-emerald-50"
  },
  {
    id: 3,
    title: "Privacy First",
    excerpt: "Deep dive into encryption protocols that keep your private index safe.",
    date: "JAN 15, 2026",
    category: "PRIVACY",
    color: "bg-rose-50"
  }
];

export default function BlogPage() {
  return (
    <div className="h-[100dvh] flex flex-col grid-bg overflow-hidden selection:bg-indigo-300">
      <Navbar />

      <main className="flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full px-6 py-8">
        <div className="mb-12">
          <h1 className="heading-brut text-5xl md:text-8xl italic">
            <span className="text-rose-500">RAW</span> THOUGHTS.
          </h1>
          <p className="font-black uppercase text-xs tracking-[0.4em] text-gray-400">Intelligence. Engineering. Privacy. Design.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {POSTS.map((post) => (
            <article key={post.id} className={`brut-card p-6 ${post.color} border-4 border-black transition-all hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_black] h-full flex flex-col`}>
              <div className="flex items-center gap-4 mb-6">
                <span className="brut-badge bg-black text-white px-3 py-1 text-[10px]">{post.category}</span>
                <span className="text-[9px] font-black uppercase text-gray-400">{post.date}</span>
              </div>

              <h2 className="heading-brut text-2xl mb-4 flex-1">
                {post.title}
              </h2>

              <p className="font-bold text-gray-600 text-xs leading-relaxed mb-8 uppercase tracking-widest">
                {post.excerpt}
              </p>

              <button className="brut-button px-6 py-2.5 text-[10px] bg-white text-black self-start flex items-center gap-2">
                READ <ArrowRight size={14} />
              </button>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
