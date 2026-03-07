"use client";

import { useState } from "react";
import Link from "next/link";
import { Brain, Menu } from "lucide-react";
import MenuOverlay from "./MenuOverlay";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b-4 border-black px-4 py-2">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-indigo-600 border-2 border-black flex items-center justify-center rotate-[-3deg] group-hover:rotate-0 transition-transform">
              <Brain className="text-white w-6 h-6" />
            </div>
            <span className="font-black text-2xl uppercase tracking-tighter">Synapse</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="brut-button py-2 px-4 md:px-6 text-xs flex items-center gap-2 group"
            >
              <Menu className="w-4 h-4 transition-transform group-hover:rotate-90" />
              <span className="mt-0.5">MENU</span>
            </button>
          </div>
        </div>
      </nav>

      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
