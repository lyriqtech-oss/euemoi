"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "@/lib/db";
import { AuthorProfile } from "@/lib/mockData";
import { Send } from "lucide-react";
import Signature from "./Signature";

export default function Footer() {
  const [profile, setProfile] = useState<AuthorProfile | null>(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    db.getProfile().then(setProfile).catch(console.error);
  }, []);

  return (
    <footer className="bg-beige-light/35 border-t border-border mt-24 py-16 px-6 relative overflow-hidden">
      {/* Decorative background grid elements */}
      <div className="absolute inset-0 bg-[radial-gradient(#d9c6ac_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 flex flex-col items-center">
        {/* Animated Signature reveal in Footer */}
        <div className="w-48 h-12 mb-6 text-brand-dark opacity-90">
          <Signature delay={0.5} className="w-full h-full" />
        </div>

        <p className="font-serif italic text-brand-brown text-center max-w-md mb-8">
          “Palavras, memórias e outras formas de permanecer.”
        </p>

        {/* Links Grid */}
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-10 text-sm uppercase tracking-widest font-sans">
          <Link href="/" className="text-brand-dark hover:text-accent-red transition-colors duration-300">
            Início
          </Link>
          <Link href="/sobre" className="text-brand-dark hover:text-accent-red transition-colors duration-300">
            Sobre
          </Link>
          <Link href="/contos" className="text-brand-dark hover:text-accent-red transition-colors duration-300">
            Contos
          </Link>
          <Link href="/cronicas" className="text-brand-dark hover:text-accent-red transition-colors duration-300">
            Crônicas
          </Link>
          <Link href="/poesias" className="text-brand-dark hover:text-accent-red transition-colors duration-300">
            Poesias
          </Link>
        </nav>

        {/* Social Links */}
        <div className="flex space-x-6 mb-8 text-brand-brown">
          {profile?.instagram && (
            <a
              href={profile.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent-red transition-colors duration-300 flex items-center gap-1.5 text-xs font-sans tracking-wider"
              aria-label="Instagram de Eu e Moi"
            >
              <svg className="w-4 h-4 fill-none stroke-[1.5]" viewBox="0 0 24 24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              <span>@euemoi</span>
            </a>
          )}
          {profile?.other_social_links?.map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent-red transition-colors duration-300 flex items-center gap-1.5 text-xs font-sans tracking-wider"
            >
              <Send className="w-3.5 h-3.5 stroke-[1.5]" />
              <span>{link.label}</span>
            </a>
          ))}
        </div>

        {/* Copyright info */}
        <div className="text-center font-sans text-[11px] text-brand-brown/70 tracking-widest uppercase border-t border-border/60 w-full max-w-lg pt-6">
          <span>{currentYear} • Eu e Moi</span>
          <span className="mx-2">•</span>
          <span className="italic">Por Natália Mello</span>
        </div>
      </div>
    </footer>
  );
}
