"use client";

import { useEffect, useState, useRef } from "react";
import { Search, X, BookOpen, Scroll, PenTool } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";
import { Post } from "@/lib/mockData";
import { AnimatePresence, motion } from "framer-motion";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      setQuery("");
      setResults([]);
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Search execution with simple debounce/trigger
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    const delayDebounce = setTimeout(async () => {
      try {
        const posts = await db.getPosts({ query: query.trim() });
        setResults(posts);
      } catch (err) {
        console.error("Erro na busca:", err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Helper to render type icons
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "conto":
        return <BookOpen className="w-4 h-4 text-accent-red" />;
      case "cronica":
        return <Scroll className="w-4 h-4 text-brand-brown" />;
      case "poesia":
        return <PenTool className="w-4 h-4 text-accent-red" />;
      default:
        return null;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "conto":
        return "Conto";
      case "cronica":
        return "Crônica";
      case "poesia":
        return "Poesia";
      default:
        return "";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-brand-dark/40 backdrop-blur-sm flex justify-center p-4 pt-[10vh]"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="w-full max-w-2xl bg-paper border border-border rounded-lg shadow-editorial flex flex-col max-h-[70vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-beige-light/10">
              <Search className="w-5 h-5 text-brand-brown stroke-[1.5]" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Busque por contos, crônicas, poesias ou tags..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent outline-none font-serif text-lg text-brand-dark placeholder:text-brand-brown/50"
              />
              <button
                onClick={onClose}
                className="p-1 rounded-full text-brand-brown hover:text-accent-red hover:bg-beige-light/20 transition-colors"
                aria-label="Fechar busca"
              >
                <X className="w-5 h-5 stroke-[1.5]" />
              </button>
            </div>

            {/* Results Area */}
            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-accent-red border-t-transparent rounded-full animate-spin" />
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-6">
                  <div className="text-xs uppercase tracking-wider text-brand-brown border-b border-border pb-2">
                    Resultados ({results.length})
                  </div>
                  <ul className="space-y-4">
                    {results.map((post) => (
                      <li key={post.id}>
                        <Link
                          href={`/texto/${post.slug}`}
                          onClick={onClose}
                          className="group block p-3 rounded border border-transparent hover:border-border hover:bg-beige-light/10 transition-all"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="flex items-center gap-1 text-[10px] uppercase font-sans tracking-widest text-brand-brown bg-beige-light px-2 py-0.5 rounded">
                              {getTypeIcon(post.type)}
                              {getTypeLabel(post.type)}
                            </span>
                            <span className="text-xs text-brand-brown font-sans">
                              {new Date(post.published_at).toLocaleDateString("pt-BR", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                          <h3 className="font-serif text-lg font-semibold text-brand-dark group-hover:text-accent-red transition-colors">
                            {post.title}
                          </h3>
                          <p className="font-serif italic text-sm text-brand-brown/80 mt-1 line-clamp-2">
                            {post.excerpt}
                          </p>
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex gap-1.5 mt-2">
                              {post.tags.map((tag) => (
                                <span
                                  key={tag.id}
                                  className="text-[10px] font-sans text-brand-brown bg-beige-light/40 px-1.5 py-0.5 rounded"
                                >
                                  #{tag.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : query.trim() ? (
                <div className="text-center py-12 text-brand-brown">
                  <p className="font-serif italic text-lg mb-1">
                    “Esta palavra parece ter se perdido no vento.”
                  </p>
                  <p className="text-sm font-sans">
                    Nenhum texto encontrado para &quot;{query}&quot;. Tente buscar por outros termos.
                  </p>
                </div>
              ) : (
                <div className="text-center py-12 text-brand-brown/60">
                  <p className="font-serif italic text-sm">
                    Digite algo para começar a explorar a biblioteca de memórias.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
