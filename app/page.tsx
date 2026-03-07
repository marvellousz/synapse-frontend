"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight, Brain, Puzzle, Share2, PlusCircle, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="h-[100dvh] flex flex-col grid-bg selection:bg-indigo-300 overflow-hidden relative">
      <Navbar />
      
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center p-4 lg:p-8 gap-12 max-w-7xl mx-auto w-full relative overflow-hidden">
        
        {/* Left Section: Editorial Content */}
        <div className="flex-1 flex flex-col items-start text-left space-y-10 z-10 w-full">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="heading-brut text-[4.5rem] md:text-[8rem] leading-[0.8] tracking-tighter mb-6">
              RECODE <br />
              <span className="text-outline">MEMORY.</span>
            </h1>

            <p className="font-serif text-xl md:text-4xl text-gray-800 leading-tight italic lowercase max-w-xl">
              A high-dimensional <span className="text-black font-bold">cognitive stack</span> that merges memories, search, context chat, and universal AI integration via MCP.
            </p>
          </motion.div>


          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <Link 
              href="/login"
              className="brut-button bg-indigo-600 px-14 py-6 text-2xl group shadow-[12px_12px_0px_0px_black] hover:shadow-[6px_6px_0px_0px_black] transition-all"
            >
              MEMORIZE <ArrowRight className="w-8 h-8 transition-transform group-hover:translate-x-2" />
            </Link>
          </motion.div>
        </div>

        {/* Right Section: Browser & Extension Mockup */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 hidden lg:flex items-center justify-center relative"
        >
          <div className="relative w-full max-w-xl">
            {/* 1. The Browser Window (Dashboard) */}
            <div className="brut-card bg-white border-4 shadow-[32px_32px_0px_0px_rgba(0,0,0,1)] relative z-10 overflow-hidden min-h-[400px]">
               {/* Browser Header */}
               <div className="bg-gray-100 border-b-2 border-black p-3 flex items-center justify-between">
                  <div className="flex gap-1.5">
                     <div className="w-3 h-3 rounded-full bg-rose-500 border border-black" />
                     <div className="w-3 h-3 rounded-full bg-amber-400 border border-black" />
                     <div className="w-3 h-3 rounded-full bg-emerald-500 border border-black" />
                  </div>
                  <div className="bg-white border-2 border-black px-4 py-0.5 rounded-full text-[10px] font-mono flex items-center gap-2 flex-1 max-w-[300px] mx-8 text-gray-500">
                     <Share2 size={10} /> synapse.ai/dashboard
                  </div>
                  <div className="w-10 h-10 bg-indigo-600 border-2 border-black flex items-center justify-center">
                     <Brain className="text-white w-5 h-5" />
                  </div>
               </div>

               {/* Dashboard Content Mock */}
               <div className="p-8 space-y-6">
                  <div className="flex items-center justify-between">
                     <h3 className="heading-brut text-2xl">Memories.</h3>
                     <div className="brut-button px-3 py-1 bg-indigo-600 text-[8px] flex items-center gap-1.5 shadow-[4px_4px_0px_0px_black]">
                        <PlusCircle size={10} /> NEW MEMORY
                     </div>
                  </div>

                  <div className="space-y-3">
                     {[
                        { title: "Project Architecture", type: "pdf", summary: "High-level overview of neural link protocols and server gateway..." },
                        { title: "User Research Lab", type: "image", summary: "Synthesized feedback from beta cohort SYN-8009 regarding indexing..." },
                        { title: "Neural Index Spec", type: "webpage", summary: "Technical requirements for high-dimensional vector embeddings..." }
                     ].map((item, i) => (
                        <div key={i} className="brut-card p-4 border-2 shadow-[6px_6px_0px_0px_black] bg-white flex flex-col gap-2 relative overflow-hidden group">
                           <div className="flex items-center gap-2">
                              <div className="brut-badge text-[8px] py-0 px-1.5 bg-indigo-100 flex items-center gap-1 border-black border-[1.5px] font-black uppercase">
                                 <FileText size={8} />
                                 {item.type}
                              </div>
                              <div className="brut-badge text-[8px] py-0 px-1.5 bg-emerald-500 text-white font-black border-black border-[1.5px] uppercase">
                                 READY
                              </div>
                           </div>
                           <div className="flex-1">
                              <div className="font-black uppercase text-xs truncate mb-1">{item.title}</div>
                              <p className="font-bold text-gray-500 text-[8px] leading-tight line-clamp-2 uppercase">
                                 {item.summary}
                              </p>
                           </div>
                        </div>
                     ))}
                  </div>

                  {/* Search Bar in Dashboard */}
                  <div className="pt-4">
                     <div className="brut-card p-3 border-4 border-black bg-indigo-50 flex items-center gap-3">
                        <ArrowRight size={18} />
                        <span className="font-mono text-xs text-gray-400 uppercase tracking-widest">Query your memory stack...</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* 2. The Browser Extension Popup (Exact Sync) */}
            <motion.div 
               animate={{ 
                  scale: [0.98, 0.98, 1, 1, 1, 0.98],
                  opacity: [0, 0, 1, 1, 0, 0],
               }}
               transition={{ 
                  duration: 4, 
                  times: [0, 0.55, 0.6, 0.85, 0.9, 1],
                  repeat: Infinity,
                  ease: "easeOut"
               }}
               className="absolute top-12 right-2 z-20 w-[240px] pointer-events-none"
            >
               <div className="brut-card bg-white border-4 shadow-[12px_12px_0px_0px_#6366F1] overflow-hidden">
                  <div className="bg-indigo-600 p-3 flex items-center justify-between border-b-2 border-black">
                     <div className="flex items-center gap-2">
                        <Puzzle className="text-white w-4 h-4" />
                        <span className="text-white font-black text-[10px] uppercase tracking-widest">Synapse_Ext</span>
                     </div>
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse border border-black" />
                  </div>
                  <div className="p-4 space-y-4 bg-white">
                     <button className="w-full brut-card p-2 bg-indigo-50 border-2 border-black text-[10px] font-black uppercase flex items-center justify-center gap-2">
                        Capture Page
                     </button>
                     <div className="space-y-2">
                        <div className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none">Status: Connected</div>
                        <div className="p-2 bg-gray-50 border border-black font-mono text-[8px] text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">
                           SYNCING: {">"} dashboard.ai <br />
                           VECTORS: 1.2M
                        </div>
                     </div>
                  </div>
               </div>
            </motion.div>

            {/* Simulated Mouse Cursor (Exact Sync) */}
            <motion.div
               animate={{ 
                  x: [400, 520, 520, 520, 520, 400], 
                  y: [300, 32, 32, 32, 32, 300],
                  opacity: [0, 1, 1, 1, 1, 0],
                  scale: [1, 1, 0.7, 1, 1, 1]
               }}
               transition={{
                  duration: 4,
                  times: [0, 0.45, 0.5, 0.55, 0.85, 1],
                  repeat: Infinity
               }}
               className="absolute z-50 pointer-events-none"
               style={{ left: 0, top: 0 }}
            >
               <div className="w-6 h-6 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M5 2L17 10L11 11L14 16L12 17L9 12L5 15V2Z" fill="black" stroke="white" strokeWidth="2"/>
                  </svg>
               </div>
            </motion.div>

          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
