"use client";

import Link from "next/link";
import { Brain, ArrowLeft, ArrowRight, Calendar, Clock } from "lucide-react";

const POSTS = [
    {
        id: 1,
        title: "The Architecture of Personal Knowledge",
        excerpt: "Exploring how semantic indexing is changing the way we interact with our own research papers and notes.",
        date: "MAR 01, 2026",
        readTime: "5 MIN",
        category: "RESEARCH",
        color: "border-indigo-600"
    },
    {
        id: 2,
        title: "OCR Beyond Characters: Understanding Context",
        excerpt: "How Synapse reads between the lines of your handwritten sketches and messy whiteboard snapshots.",
        date: "FEB 24, 2026",
        readTime: "8 MIN",
        category: "ENGINEERING",
        color: "border-emerald-500"
    },
    {
        id: 3,
        title: "Securing the Second Brain",
        excerpt: "A deep dive into the encryption protocols that keep your private index safe from the outside world.",
        date: "JAN 15, 2026",
        readTime: "12 MIN",
        category: "PRIVACY",
        color: "border-rose-500"
    }
];

export default function BlogPage() {
    return (
        <div className="min-h-screen grid-bg selection:bg-indigo-300">
            <nav className="sticky top-0 z-50 bg-white border-b-4 border-black px-4 py-3">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-indigo-600 border-2 border-black flex items-center justify-center rotate-[-3deg] group-hover:rotate-0 transition-transform">
                            <Brain className="text-white w-6 h-6" />
                        </div>
                        <span className="font-black text-2xl uppercase tracking-tighter">Synapse</span>
                    </Link>
                    <Link href="/signup" className="brut-button py-2 px-6 text-sm">
                        Get Started
                    </Link>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-4 py-20">
                <Link href="/" className="inline-flex items-center gap-2 font-black uppercase text-[10px] tracking-widest text-gray-500 hover:text-black mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>

                <h1 className="heading-brut text-5xl md:text-8xl mb-4 italic">
                    <span className="text-rose-500">RAW</span> THOUGHTS.
                </h1>
                <p className="font-black uppercase text-xs tracking-[0.3em] text-gray-400 mb-16">Intelligence. Engineering. Privacy. Design.</p>

                <div className="grid gap-12">
                    {POSTS.map((post) => (
                        <article key={post.id} className={`brut-card p-1 bg-white border-4 border-black transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[12px_12px_0px_0px_black]`}>
                            <div className="p-8">
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="brut-badge bg-black text-white px-3 py-1 text-[10px]">{post.category}</span>
                                    <div className="flex items-center gap-4 text-[10px] font-black uppercase text-gray-400">
                                        <span className="flex items-center gap-1.5"><Calendar size={14} /> {post.date}</span>
                                        <span className="flex items-center gap-1.5"><Clock size={14} /> {post.readTime}</span>
                                    </div>
                                </div>

                                <h2 className="heading-brut text-3xl md:text-4xl mb-6 hover:text-indigo-600 transition-colors pointer-events-auto cursor-pointer">
                                    {post.title}
                                </h2>

                                <p className="font-bold text-gray-600 text-sm md:text-base leading-relaxed mb-8 max-w-2xl uppercase">
                                    {post.excerpt}
                                </p>

                                <button className="brut-button px-6 py-2.5 text-xs bg-white text-black hover:bg-black hover:text-white">
                                    READ FULL ARTICLE <ArrowRight size={14} />
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            </main>

            <footer className="bg-black text-white py-12 px-4 mt-20">
                <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-indigo-600 border-2 border-white flex items-center justify-center rotate-[-3deg]">
                            <Brain className="text-white w-6 h-6" />
                        </div>
                        <span className="font-black text-2xl uppercase tracking-tighter">Synapse</span>
                    </Link>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                        © 2026 SYNAPSE CORP · REWIRING KNOWLEDGE
                    </div>
                </div>
            </footer>
        </div>
    );
}
