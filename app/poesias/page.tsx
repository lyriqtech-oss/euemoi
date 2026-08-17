"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { db } from "@/lib/db";
import { Post } from "@/lib/mockData";

export default function Poesias() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.getPosts({ type: "poesia", includeDrafts: false })
      .then(setPosts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Helper to extract first few lines of a poem for display snippet
  const getPoemSnippet = (htmlContent: string) => {
    // Strip HTML tags except p and br
    const text = htmlContent
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<[^>]*>/g, "");
    
    // Get first 4 non-empty lines
    const lines = text.split("\n").filter(line => line.trim().length > 0);
    return lines.slice(0, 4).join("\n");
  };

  return (
    <>
      <Header />

      <main className="min-h-screen pt-28 md:pt-36 pb-16 px-6 max-w-2xl mx-auto">
        <div className="space-y-24">
          {/* Editorial Poetry Header */}
          <div className="space-y-4 text-center border-b border-border/60 pb-8">
            <span className="font-sans text-xs uppercase tracking-widest text-accent-red font-semibold">
              Gênero Literário
            </span>
            <h1 className="font-serif text-4xl font-semibold text-brand-dark tracking-wide">
              Poesias
            </h1>
            <p className="font-serif italic text-brand-brown max-w-sm mx-auto leading-relaxed">
              “Versos para o que não caberia em outra forma.”
            </p>
          </div>

          {/* Listing Area */}
          {loading ? (
            <div className="space-y-16 animate-pulse flex flex-col items-center">
              {[1, 2].map((n) => (
                <div key={n} className="space-y-4 w-full flex flex-col items-center">
                  <div className="h-6 bg-beige-medium w-48 rounded" />
                  <div className="h-4 bg-beige-medium w-36 rounded" />
                  <div className="h-20 bg-beige-medium w-56 rounded" />
                </div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="space-y-24 flex flex-col items-center">
              {posts.map((post, index) => {
                const formattedDate = new Date(post.published_at).toLocaleDateString("pt-BR", {
                  year: "numeric",
                  month: "long",
                });

                return (
                  <article
                    key={post.id}
                    className="w-full flex flex-col items-center text-center space-y-6"
                  >
                    {/* Poem Title */}
                    <div className="space-y-2">
                      <h2 className="font-serif text-2xl md:text-3xl font-medium tracking-wide text-brand-dark hover:text-accent-red transition-colors duration-300">
                        <Link href={`/texto/${post.slug}`}>{post.title}</Link>
                      </h2>
                      <div className="font-sans text-[10px] uppercase tracking-widest text-brand-brown/70">
                        {formattedDate}
                      </div>
                    </div>

                    {/* Poetry Snippet Preview */}
                    <pre className="font-serif italic text-base md:text-lg leading-loose text-brand-dark/90 whitespace-pre-wrap font-normal max-w-md mx-auto py-2">
                      {getPoemSnippet(post.content)}
                      {"\n..."}
                    </pre>

                    {/* Link to read full poem */}
                    <div>
                      <Link
                        href={`/texto/${post.slug}`}
                        className="font-sans text-xs uppercase tracking-widest text-accent-red hover:text-accent-red-hover font-semibold transition-colors border-b border-accent-red/30 hover:border-accent-red pb-1"
                      >
                        Ler poema completo →
                      </Link>
                    </div>

                    {/* Anthology Ornament Separator (not shown on last item) */}
                    {index < posts.length - 1 && (
                      <div className="text-accent-red/40 text-sm font-serif select-none pt-12">
                        ♦
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 text-brand-brown">
              <p className="font-serif italic text-lg mb-1">“Nenhum verso por aqui.”</p>
              <p className="text-sm font-sans">Aguardando novas inspirações.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
