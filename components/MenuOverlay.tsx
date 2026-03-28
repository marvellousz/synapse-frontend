"use client";

import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { Brain, X, ArrowRight } from "lucide-react";

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const MENU_LINKS = [
  { href: "/", label: "Home" },
  { href: "/memories", label: "Archive" },
  { href: "/folders", label: "Folders" },
  { href: "/graph", label: "Graph" },
  { href: "/chat", label: "Chat" },
  { href: "/features", label: "Features" },
];

export default function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ clipPath: "circle(0% at 100% 0%)" }}
          animate={{ clipPath: "circle(150% at 100% 0%)" }}
          exit={{ clipPath: "circle(0% at 100% 0%)" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[60] bg-black text-white border-[12px] border-white flex flex-col"
        >
          {/* Menu Header */}
          <div className="flex justify-between items-center px-8 py-6 border-b-4 border-white">
            <Link href="/" onClick={onClose} className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center rotate-[-3deg] group-hover:rotate-0 transition-transform">
                <Brain className="text-black w-6 h-6" />
              </div>
              <span className="font-black text-2xl uppercase tracking-tighter text-white">Synapse</span>
            </Link>
            <button 
              onClick={onClose}
              className="brut-button p-3 bg-white text-black"
              aria-label="Close Menu"
            >
              <X className="w-8 h-8" strokeWidth={3} />
            </button>
          </div>

          {/* Menu Content - Centered Single Column */}
          <div className="flex-1 flex flex-col items-center justify-between py-6 px-6 md:px-12 relative overflow-hidden">
            {/* Background Text Decor */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
               <span className="font-black text-[30vw] uppercase leading-none">Synapse</span>
            </div>

            <div className="flex flex-col items-center justify-center gap-1 md:gap-2 relative z-10 w-full flex-1">
              {MENU_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i + 0.3, duration: 0.5 }}
                  className="w-full flex justify-center"
                >
                  <Link 
                    href={link.href} 
                    onClick={onClose}
                    className="heading-brut text-[clamp(2.25rem,8vw,5.5rem)] leading-[0.9] hover:text-indigo-400 transition-all inline-flex items-center group text-white uppercase italic tracking-tighter hover:scale-105"
                  >
                      <span>
                       {link.label}
                    </span>
                    <ArrowRight className="w-6 h-6 md:w-12 md:h-12 opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-5 transition-all text-indigo-400" strokeWidth={5} />
                  </Link>
                </motion.div>
              ))}
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
