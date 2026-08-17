"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import SearchModal from "./SearchModal";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: "Início", href: "/" },
    { label: "Sobre", href: "/sobre" },
    { label: "Contos", href: "/contos" },
    { label: "Crônicas", href: "/cronicas" },
    { label: "Poesias", href: "/poesias" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? "bg-paper/95 backdrop-blur-sm border-b border-border shadow-soft py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          {/* Brand Signature */}
          <Link
            href="/"
            className="font-serif text-2xl font-semibold tracking-wide text-brand-dark transition duration-300 hover:text-accent-red flex items-center gap-2"
          >
            <span className="italic">Eu e Moi</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-sans text-sm uppercase tracking-widest transition-colors duration-300 relative py-1 ${
                  isActive(link.href)
                    ? "text-accent-red font-medium"
                    : "text-brand-brown hover:text-accent-red"
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <motion.span
                    layoutId="activeNavLine"
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-accent-red"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-brand-brown hover:text-accent-red transition-colors duration-300"
              aria-label="Buscar textos"
            >
              <Search className="w-5 h-5 stroke-[1.5]" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-brand-brown hover:text-accent-red transition-colors duration-300"
              aria-label="Abrir menu"
            >
              <Menu className="w-6 h-6 stroke-[1.5]" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 md:hidden bg-brand-dark/20 backdrop-blur-sm"
          >
            {/* Drawer Content */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-paper border-l border-border p-8 flex flex-col justify-between shadow-editorial"
            >
              <div>
                <div className="flex items-center justify-between mb-12">
                  <span className="font-serif text-xl italic text-brand-dark">Eu e Moi</span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-brand-brown hover:text-accent-red transition-colors duration-300"
                    aria-label="Fechar menu"
                  >
                    <X className="w-6 h-6 stroke-[1.5]" />
                  </button>
                </div>

                <nav className="flex flex-col space-y-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`font-serif text-2xl tracking-wide transition-colors duration-300 ${
                        isActive(link.href)
                          ? "text-accent-red font-medium pl-2 border-l-2 border-accent-red"
                          : "text-brand-dark hover:text-accent-red pl-0"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Drawer Footer */}
              <div className="text-center font-sans text-xs text-brand-brown tracking-wider uppercase border-t border-border pt-6">
                Natália Mello
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
