"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { db } from "@/lib/db";
import { Post, Tag } from "@/lib/mockData";
import { Search } from "lucide-react";

export default function Cronicas() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [postsData, tagsData] = await Promise.all([
          db.getPosts({
            type: "cronica",
            includeDrafts: false,
            query: searchQuery,
            tag: selectedTag || undefined,
          }),
          db.getTags(),
        ]);
        setPosts(postsData);
        setTags(tagsData);
      } catch (err) {
        console.error("Erro ao carregar crônicas:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [searchQuery, selectedTag]);

  return (
    <>
      <Header />

      <main className="min-h-screen pt-28 md:pt-36 pb-16 px-6 max-w-4xl mx-auto">
        <div className="space-y-12">
          {/* Editorial Category Header */}
          <div className="space-y-4 text-center border-b border-border/60 pb-8">
            <span className="font-sans text-xs uppercase tracking-widest text-brand-brown font-semibold">
              Gênero Literário
            </span>
            <h1 className="font-serif text-4xl font-semibold text-brand-dark tracking-wide">
              Crônicas
            </h1>
            <p className="font-serif italic text-brand-brown max-w-md mx-auto leading-relaxed">
              “Palavras para aquilo que quase passa despercebido.”
            </p>
          </div>

          {/* Filtering and Search Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-border/40 pb-6">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-xs flex items-center border border-border bg-paper/50 px-3 py-1.5 rounded">
              <Search className="w-4 h-4 text-brand-brown/50 mr-2" />
              <input
                type="text"
                placeholder="Buscar crônicas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent outline-none font-sans text-xs uppercase tracking-wider text-brand-dark placeholder:text-brand-brown/40"
              />
            </div>

            {/* Tags list */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 text-[11px] font-sans justify-center sm:justify-end">
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`px-2 py-0.5 border transition-colors ${
                    !selectedTag
                      ? "border-accent-red text-accent-red font-semibold"
                      : "border-transparent text-brand-brown hover:text-accent-red"
                  }`}
                >
                  Tudo
                </button>
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => setSelectedTag(tag.slug)}
                    className={`px-2 py-0.5 border transition-colors ${
                      selectedTag === tag.slug
                        ? "border-accent-red text-accent-red font-semibold"
                        : "border-transparent text-brand-brown hover:text-accent-red"
                    }`}
                  >
                    #{tag.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Minimal Listing Area */}
          {loading ? (
            <div className="space-y-6 animate-pulse">
              {[1, 2, 3].map((n) => (
                <div key={n} className="border-b border-border/30 py-4 flex justify-between">
                  <div className="h-5 bg-beige-medium w-1/2 rounded" />
                  <div className="h-4 bg-beige-medium w-24 rounded" />
                </div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="divide-y divide-border/60">
              {posts.map((post) => {
                const formattedDate = new Date(post.published_at).toLocaleDateString("pt-BR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                });
                return (
                  <div
                    key={post.id}
                    className="py-6 flex flex-col md:flex-row md:items-baseline md:justify-between group transition-all duration-300"
                  >
                    <div className="space-y-1 max-w-2xl">
                      <Link
                        href={`/texto/${post.slug}`}
                        className="font-serif text-xl font-medium text-brand-dark group-hover:text-accent-red transition-colors duration-300 block"
                      >
                        {post.title}
                      </Link>
                      <p className="font-serif italic text-sm text-brand-brown/70 line-clamp-1">
                        {post.excerpt}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 mt-2 md:mt-0 font-sans text-xs text-brand-brown/80 whitespace-nowrap">
                      <span>{formattedDate}</span>
                      <span className="text-border">|</span>
                      <Link
                        href={`/texto/${post.slug}`}
                        className="text-accent-red hover:underline font-semibold"
                      >
                        Ler →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-border rounded text-brand-brown">
              <p className="font-serif italic text-lg mb-1">“Nenhuma crônica por aqui.”</p>
              <p className="text-sm font-sans">
                Tente alterar a busca ou filtro de temas.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
