"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PostPreview from "@/components/PostPreview";
import { db } from "@/lib/db";
import { Post, Tag } from "@/lib/mockData";
import { Search, SlidersHorizontal } from "lucide-react";

export default function Contos() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "oldest">("recent");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [postsData, tagsData] = await Promise.all([
          db.getPosts({
            type: "conto",
            includeDrafts: false,
            query: searchQuery,
            tag: selectedTag || undefined,
          }),
          db.getTags(),
        ]);
        
        let sorted = [...postsData];
        if (sortBy === "oldest") {
          sorted.sort(
            (a, b) => new Date(a.published_at).getTime() - new Date(b.published_at).getTime()
          );
        }
        
        setPosts(sorted);
        setTags(tagsData);
      } catch (err) {
        console.error("Erro ao carregar contos:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [searchQuery, selectedTag, sortBy]);

  return (
    <>
      <Header />

      <main className="min-h-screen pt-28 md:pt-36 pb-16 px-6 max-w-4xl mx-auto">
        <div className="space-y-12">
          {/* Editorial Category Header */}
          <div className="space-y-4 text-center border-b border-border/60 pb-8">
            <span className="font-sans text-xs uppercase tracking-widest text-accent-red font-semibold">
              Gênero Literário
            </span>
            <h1 className="font-serif text-4xl font-semibold text-brand-dark tracking-wide">
              Contos
            </h1>
            <p className="font-serif italic text-brand-brown max-w-md mx-auto leading-relaxed">
              “Histórias sobre aquilo que aconteceu, poderia ter acontecido ou talvez ainda aconteça.”
            </p>
          </div>

          {/* Filtering and Search Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-border/40 pb-6">
            {/* Search Input */}
            <div className="relative w-full md:max-w-xs flex items-center border border-border bg-paper/50 px-3 py-2 rounded">
              <Search className="w-4 h-4 text-brand-brown/50 mr-2" />
              <input
                type="text"
                placeholder="Buscar contos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent outline-none font-sans text-xs uppercase tracking-wider text-brand-dark placeholder:text-brand-brown/40"
              />
            </div>

            {/* Sort Controls */}
            <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-6 text-xs uppercase tracking-widest font-sans text-brand-brown">
              <div className="flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 stroke-[1.5]" />
                <span>Ordenar:</span>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setSortBy("recent")}
                  className={`font-semibold transition-colors duration-300 ${
                    sortBy === "recent" ? "text-accent-red underline underline-offset-4" : "hover:text-accent-red"
                  }`}
                >
                  Recentes
                </button>
                <button
                  onClick={() => setSortBy("oldest")}
                  className={`font-semibold transition-colors duration-300 ${
                    sortBy === "oldest" ? "text-accent-red underline underline-offset-4" : "hover:text-accent-red"
                  }`}
                >
                  Antigos
                </button>
              </div>
            </div>
          </div>

          {/* Tags list */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 text-xs font-sans">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-3 py-1 border transition-colors ${
                  !selectedTag
                    ? "bg-brand-dark border-brand-dark text-paper"
                    : "border-border text-brand-brown hover:border-accent-red"
                }`}
              >
                Todos os temas
              </button>
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => setSelectedTag(tag.slug)}
                  className={`px-3 py-1 border transition-colors ${
                    selectedTag === tag.slug
                      ? "bg-brand-dark border-brand-dark text-paper"
                      : "border-border text-brand-brown hover:border-accent-red"
                  }`}
                >
                  #{tag.name}
                </button>
              ))}
            </div>
          )}

          {/* Listing Area */}
          {loading ? (
            <div className="space-y-8 animate-pulse">
              {[1, 2, 3].map((n) => (
                <div key={n} className="border-b border-border/40 pb-8 space-y-3">
                  <div className="h-4 bg-beige-medium w-48 rounded" />
                  <div className="h-6 bg-beige-medium w-2/3 rounded" />
                  <div className="h-4 bg-beige-medium w-full rounded" />
                </div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="space-y-12">
              {posts.map((post) => (
                <PostPreview key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-border rounded text-brand-brown">
              <p className="font-serif italic text-lg mb-1">“Nenhum conto por aqui.”</p>
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
