"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Copy, Eye, EyeOff, Share2, MessageSquare } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RichTextRenderer from "@/components/RichTextRenderer";
import ReadingProgress from "@/components/ReadingProgress";
import { db } from "@/lib/db";
import { Post } from "@/lib/mockData";

export default function TextoPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [focusMode, setFocusMode] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  useEffect(() => {
    async function loadPost() {
      try {
        setLoading(true);
        const postData = await db.getPostBySlug(slug);
        setPost(postData);
      } catch (err) {
        console.error("Erro ao carregar o texto:", err);
      } finally {
        setLoading(false);
      }
    }
    if (slug) loadPost();
  }, [slug]);

  // Copy link to clipboard
  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2500);
    }
  };

  const getTypeText = (type: string) => {
    return type === "cronica" ? "Crônica" : type === "conto" ? "Conto" : "Poesia";
  };

  const getReadingTime = (content: string) => {
    const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    const mins = Math.ceil(words / 200);
    return `${mins} min de leitura`;
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="w-8 h-8 border-3 border-accent-red border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <p className="font-serif italic text-2xl text-brand-dark mb-4">
            “Esta página parece ter se perdido entre as palavras.”
          </p>
          <Link
            href="/"
            className="font-sans text-xs uppercase tracking-widest text-accent-red hover:underline font-semibold"
          >
            Voltar ao início →
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const formattedDate = new Date(post.published_at).toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className={`min-h-screen focus-transition ${focusMode ? "bg-paper py-16" : ""}`}>
      {/* Scroll indicator - hide during Focus Mode */}
      {!focusMode && <ReadingProgress />}

      {/* Header - hide during Focus Mode */}
      {!focusMode && <Header />}

      {/* Focus Mode Close Button */}
      {focusMode && (
        <div className="fixed top-6 right-6 z-50">
          <button
            onClick={() => setFocusMode(false)}
            className="flex items-center gap-2 px-3 py-1.5 border border-border bg-paper hover:bg-beige-light/20 text-xs font-sans uppercase tracking-widest text-brand-brown hover:text-accent-red transition-all duration-300 shadow-soft"
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>Sair do Foco</span>
          </button>
        </div>
      )}

      {/* Main Text Content */}
      <main className="max-w-3xl mx-auto px-6 pt-24 pb-16 md:pt-36">
        <article className="space-y-12">
          {/* Header metadata */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-sans text-brand-brown">
              <span className="text-accent-red font-semibold">{getTypeText(post.type)}</span>
              <span>•</span>
              <span>{getReadingTime(post.content)}</span>
            </div>
            
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-brand-dark leading-tight max-w-2xl mx-auto">
              {post.title}
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-x-4 gap-y-1 pt-2 font-sans text-xs text-brand-brown/80">
              <span className="font-semibold uppercase tracking-wider">Natália Mello</span>
              <span className="hidden sm:inline text-border">|</span>
              <span>{formattedDate}</span>
            </div>

            {/* Foco Button inside metadata */}
            {!focusMode && (
              <div className="pt-2">
                <button
                  onClick={() => setFocusMode(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-sans uppercase tracking-widest text-brand-brown hover:text-accent-red transition-colors border border-transparent hover:border-border/80 px-2.5 py-1 rounded"
                  title="Ocultar navegação e ler em tela cheia"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Modo Foco</span>
                </button>
              </div>
            )}
          </div>

          <div className="w-16 h-[1px] bg-border mx-auto my-8" />

          {/* Reading Column */}
          <div className="max-w-[650px] mx-auto">
            {post.type === "poesia" ? (
              // Specialized Poetry centering
              <div
                className="poetry-content prose-literary"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            ) : (
              // Stories/Chronicles justified formatting
              <RichTextRenderer content={post.content} />
            )}
          </div>

          <div className="w-16 h-[1px] bg-border mx-auto my-12" />

          {/* Signature / Ending tag */}
          <div className="text-center space-y-2">
            <span className="font-serif italic text-lg text-brand-brown">eu e moi</span>
          </div>

          {/* Share widget - hide during Focus Mode */}
          {!focusMode && (
            <div className="border-t border-border/60 pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {post.tags?.map((t) => (
                  <Link
                    key={t.id}
                    href={`/${post.type === "conto" ? "contos" : post.type === "cronica" ? "cronicas" : "poesias"}?tag=${t.slug}`}
                    className="text-xs font-sans text-brand-brown/80 hover:text-accent-red hover:underline"
                  >
                    #{t.name}
                  </Link>
                ))}
              </div>

              {/* Share links */}
              <div className="flex items-center gap-3">
                <span className="font-sans text-xs uppercase tracking-widest text-brand-brown flex items-center gap-1">
                  <Share2 className="w-3.5 h-3.5 stroke-[1.5]" />
                  <span>Compartilhar:</span>
                </span>
                
                <div className="flex items-center gap-2">
                  {/* WhatsApp */}
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `Leia "${post.title}", um texto de Natália Mello (Eu e Moi): ${typeof window !== "undefined" ? window.location.href : ""}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full border border-border hover:border-accent-red hover:bg-beige-light/20 text-brand-brown hover:text-accent-red transition-all"
                    aria-label="Compartilhar no WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4 stroke-[1.5]" />
                  </a>

                  {/* X (Twitter) */}
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      `Leia "${post.title}" por Natália Mello (@euemoi)`
                    )}&url=${typeof window !== "undefined" ? encodeURIComponent(window.location.href) : ""}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full border border-border hover:border-accent-red hover:bg-beige-light/20 text-brand-brown hover:text-accent-red transition-all"
                    aria-label="Compartilhar no X (Twitter)"
                  >
                    <svg className="w-4 h-4 fill-none stroke-[1.5]" viewBox="0 0 24 24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                    </svg>
                  </a>

                  {/* Facebook */}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${typeof window !== "undefined" ? encodeURIComponent(window.location.href) : ""}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full border border-border hover:border-accent-red hover:bg-beige-light/20 text-brand-brown hover:text-accent-red transition-all"
                    aria-label="Compartilhar no Facebook"
                  >
                    <svg className="w-4 h-4 fill-none stroke-[1.5]" viewBox="0 0 24 24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </a>

                  {/* Copy Link */}
                  <button
                    onClick={handleCopyLink}
                    className="p-2 rounded-full border border-border hover:border-accent-red hover:bg-beige-light/20 text-brand-brown hover:text-accent-red transition-all relative"
                    aria-label="Copiar link do texto"
                  >
                    <Copy className="w-4 h-4 stroke-[1.5]" />
                    {shareToast && (
                      <span className="absolute bottom-10 right-0 bg-brand-dark text-paper text-[10px] px-2 py-0.5 rounded shadow-soft uppercase tracking-wider font-sans whitespace-nowrap">
                        Copiado!
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </article>
      </main>

      {/* Footer - hide during Focus Mode */}
      {!focusMode && <Footer />}
    </div>
  );
}
