"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-black/80 backdrop-blur-xl border-b border-white/5" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-white tracking-tight">
          Flash
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="#product" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Product</Link>
          <Link href="#company" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Company</Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/demo" className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">Try Demo</Link>
          <Link href="/dashboard" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Dashboard</Link>
          <Link href="/contact" className="px-6 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-gray-100 transition-colors">
            Contact Us
          </Link>
        </div>

        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-b border-white/10">
          <div className="px-6 py-8 flex flex-col gap-6">
            <Link href="#product" className="text-lg font-medium text-white/80" onClick={() => setMobileMenuOpen(false)}>Product</Link>
            <Link href="#company" className="text-lg font-medium text-white/80" onClick={() => setMobileMenuOpen(false)}>Company</Link>
            <div className="h-px bg-white/10 my-2" />
            <Link href="/login" className="text-lg font-medium text-white/80" onClick={() => setMobileMenuOpen(false)}>Sign in</Link>
            <Link href="/contact" className="w-full py-3 rounded-full bg-white text-black text-center font-semibold" onClick={() => setMobileMenuOpen(false)}>
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
