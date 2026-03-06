"use client";

import Link from "next/link";
import { Brain, ArrowLeft, Heart, Shield, Users, Sparkles, Zap } from "lucide-react";

export default function AboutPage() {
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

            <main className="max-w-4xl mx-auto px-4 py-20">
                <Link href="/" className="inline-flex items-center gap-2 font-black uppercase text-[10px] tracking-widest text-gray-500 hover:text-black mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>

                <h1 className="heading-brut text-5xl md:text-7xl mb-8 uppercase">
                    Beyond <span className="text-emerald-500">Traditional</span> Notes.
                </h1>

                <p className="text-xl md:text-2xl font-bold mb-16 leading-tight uppercase italic text-gray-700">
                    Synapse was built on a single premise: Your brain is for <span className="text-indigo-600 px-1 underline decoration-4">computing</span>, not just storing.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="brut-card p-8 bg-white shadow-[8px_8px_0px_0px_#4F46E5] border-indigo-600">
                        <div className="w-12 h-12 bg-indigo-600 text-white flex items-center justify-center border-2 border-black mb-6 rotate-[-5deg]">
                            <Heart className="w-6 h-6" />
                        </div>
                        <h3 className="heading-brut text-2xl mb-4">The Mission</h3>
                        <p className="font-bold text-gray-600 uppercase text-xs leading-relaxed tracking-widest">
                            We are building a cognitive architecture that scales with your curiosity. No more folders, no more tagging manually—just pure knowledge flow.
                        </p>
                    </div>

                    <div className="brut-card p-8 bg-white shadow-[8px_8px_0px_0px_#10B981] border-emerald-500">
                        <div className="w-12 h-12 bg-emerald-500 text-white flex items-center justify-center border-2 border-black mb-6 rotate-[5deg]">
                            <Shield className="w-6 h-6" />
                        </div>
                        <h3 className="heading-brut text-2xl mb-4">Privacy First</h3>
                        <p className="font-bold text-gray-600 uppercase text-xs leading-relaxed tracking-widest">
                            Your "Second Brain" contains your private thoughts. We treat it with clinical security. Encrypted by default, private by design.
                        </p>
                    </div>

                    <div className="brut-card p-8 bg-white shadow-[8px_8px_0px_0px_#F43F5E] border-rose-500 overflow-hidden relative">
                        <div className="absolute -bottom-4 -right-4 opacity-10">
                            <Sparkles size={120} />
                        </div>
                        <div className="w-12 h-12 bg-rose-500 text-white flex items-center justify-center border-2 border-black mb-6 rotate-[-2deg]">
                            <Users className="w-6 h-6" />
                        </div>
                        <h3 className="heading-brut text-2xl mb-4">Collective Intelligence</h3>
                        <p className="font-bold text-gray-600 uppercase text-xs leading-relaxed tracking-widest">
                            Join a community of researchers, writers, and power users who are redefining what it means to "know" something in 2026.
                        </p>
                    </div>

                    <div className="brut-card p-8 bg-white shadow-[8px_8px_0px_0px_#FBBD23] border-amber-500">
                        <div className="w-12 h-12 bg-amber-400 text-black flex items-center justify-center border-2 border-black mb-6 rotate-[3deg]">
                            <Zap className="w-6 h-6" />
                        </div>
                        <h3 className="heading-brut text-2xl mb-4">Infinite Scaling</h3>
                        <p className="font-bold text-gray-600 uppercase text-xs leading-relaxed tracking-widest">
                            From a single thought to a lifetime of research. Synapse is built to handle millions of connections without breaking a sweat or losing a link.
                        </p>
                    </div>
                </div>

                <div className="mt-20 p-12 bg-black text-white border-4 border-black shadow-[12px_12px_0px_0px_#4F46E5]">
                    <h2 className="heading-brut text-4xl mb-6">Built for the future of thought.</h2>
                    <Link href="/signup" className="brut-button bg-indigo-600 px-10 py-4 inline-block text-xl">
                        JOIN THE PROTOCOL
                    </Link>
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
