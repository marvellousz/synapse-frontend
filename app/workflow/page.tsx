"use client";

import Link from "next/link";
import { Brain, ArrowLeft, Zap, Search, Layers, Database } from "lucide-react";

export default function WorkflowPage() {
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

                <h1 className="heading-brut text-5xl md:text-7xl mb-12 uppercase italic">
                    The <span className="text-indigo-600">Synapse</span> Protocol.
                </h1>

                <div className="space-y-16">
                    {/* Step 1 */}
                    <div className="brut-card p-8 bg-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 py-2 px-6 bg-black text-white font-black text-xs uppercase">Step 01</div>
                        <div className="flex items-start gap-6">
                            <div className="w-16 h-16 bg-indigo-100 border-4 border-black flex items-center justify-center shrink-0 rotate-[-5deg]">
                                <Layers className="w-8 h-8 text-indigo-600" />
                            </div>
                            <div>
                                <h2 className="heading-brut text-3xl mb-4">Multimodal Capture</h2>
                                <p className="font-bold text-gray-600 leading-relaxed mb-6 uppercase text-sm">
                                    Whether it's a 50-page PDF, a quick snapshot of a whiteboard, or a 20-minute YouTube lecture, Synapse consumes it all.
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 border-2 border-black font-black text-[10px] uppercase tracking-widest">PDF Encryption Handling</div>
                                    <div className="p-4 bg-gray-50 border-2 border-black font-black text-[10px] uppercase tracking-widest">OCR Pipeline</div>
                                    <div className="p-4 bg-gray-50 border-2 border-black font-black text-[10px] uppercase tracking-widest">Web Scraping logic</div>
                                    <div className="p-4 bg-gray-50 border-2 border-black font-black text-[10px] uppercase tracking-widest">Video Frame Analysis</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="brut-card p-8 bg-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 py-2 px-6 bg-black text-white font-black text-xs uppercase">Step 02</div>
                        <div className="flex items-start gap-6">
                            <div className="w-16 h-16 bg-emerald-100 border-4 border-black flex items-center justify-center shrink-0 rotate-[5deg]">
                                <Database className="w-8 h-8 text-emerald-600" />
                            </div>
                            <div>
                                <h2 className="heading-brut text-3xl mb-4">Semantic Indexing</h2>
                                <p className="font-bold text-gray-600 leading-relaxed mb-6 uppercase text-sm">
                                    Our system breaks down your content into high-dimensional vectors. We don't just store text; we store relationships and concepts.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="brut-badge bg-emerald-50 text-emerald-700 border-emerald-500">Vector Embeddings</span>
                                    <span className="brut-badge bg-emerald-50 text-emerald-700 border-emerald-500">Metadata Extraction</span>
                                    <span className="brut-badge bg-emerald-50 text-emerald-700 border-emerald-500">Cross-Reference Engine</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="brut-card p-8 bg-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 py-2 px-6 bg-black text-white font-black text-xs uppercase">Step 03</div>
                        <div className="flex items-start gap-6">
                            <div className="w-16 h-16 bg-rose-100 border-4 border-black flex items-center justify-center shrink-0 rotate-[-3deg]">
                                <Search className="w-8 h-8 text-rose-600" />
                            </div>
                            <div>
                                <h2 className="heading-brut text-3xl mb-4">Natural Retrieval</h2>
                                <p className="font-bold text-gray-600 leading-relaxed mb-6 uppercase text-sm">
                                    Search by intent, not by keywords. Find the "exact moment in that video where he mentioned scaling" just by asking.
                                </p>
                                <Link href="/signup" className="brut-button bg-black text-white px-8 py-3 text-xs inline-flex items-center gap-2">
                                    JOIN NOW <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
                                </Link>
                            </div>
                        </div>
                    </div>
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
