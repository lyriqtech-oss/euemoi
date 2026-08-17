"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowRight, BookOpen, Scroll, PenTool, ArrowUpRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthorPortraitAnimation from "@/components/AuthorPortraitAnimation";
import Signature from "@/components/Signature";
import FeaturedPost from "@/components/FeaturedPost";
import { db } from "@/lib/db";
import { Post, AuthorProfile } from "@/lib/mockData";

export default function Home() {
  const [profile, setProfile] = useState<AuthorProfile | null>(null);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [featuredPost, setFeaturedPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [profData, postsData] = await Promise.all([
          db.getProfile(),
          db.getPosts({ includeDrafts: false }),
        ]);
        setProfile(profData);
        setRecentPosts(postsData.slice(0, 3)); // show first 3 recent
        
        // Find post defined as featured, or fallback to the latest post
        const featured = postsData.find((p) => p.featured) || postsData[0] || null;
        setFeaturedPost(featured);
      } catch (err) {
        console.error("Erro ao carregar dados da Home:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getReadingTime = (content: string) => {
    const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    const mins = Math.ceil(words / 200);
    return `${mins} min`;
  };

  const getTypeText = (type: string) => {
    return type === "cronica" ? "Crônica" : type === "conto" ? "Conto" : "Poesia";
  };

  return (
    <>
      <Header />
      
      {/* Dynamic Background Noise Texture overlay */}
      <div className="fixed inset-0 bg-noise pointer-events-none opacity-20 z-50" />

      {/* 1. HERO SECTION (Editorial Book layout) */}
      <section className="min-h-screen pt-28 md:pt-36 pb-20 px-6 flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-beige-light/25 via-transparent to-transparent">
        {/* Editorial Side Running-Headers (Physical book tabs) */}
        <div className="hidden lg:block absolute left-8 top-1/2 -translate-y-1/2 -rotate-90 origin-left text-[10px] tracking-[0.3em] font-sans uppercase text-brand-brown/50 pointer-events-none font-bold">
          Caderno Literário — Eu e Moi
        </div>
        <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 rotate-90 origin-right text-[10px] tracking-[0.3em] font-sans uppercase text-brand-brown/50 pointer-events-none font-bold">
          Edição N. 01 — Outono
        </div>

        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 bg-[radial-gradient(#d9c6ac_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
        
        {/* Soft background line indicators */}
        <div className="absolute left-[15%] top-0 bottom-0 w-[1px] bg-border/20 hidden md:block" />
        <div className="absolute right-[15%] top-0 bottom-0 w-[1px] bg-border/20 hidden md:block" />

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10 w-full">
          
          {/* Left Hero: Text composition */}
          <div className="md:col-span-6 text-left space-y-8 flex flex-col justify-center order-2 md:order-1">
            <div className="space-y-4">
              <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-accent-red font-bold flex items-center gap-2">
                <span>Espaço de Escrita</span>
                <span className="w-1.5 h-1.5 rounded-full bg-accent-red" />
                <span>Natália Mello</span>
              </span>

              {/* Title handwritten animation */}
              <div className="w-64 md:w-72 h-14 text-brand-dark -ml-2 select-none">
                <Signature className="w-full h-full" delay={0.4} />
              </div>
            </div>

            {/* Tagline tag */}
            <div className="relative max-w-lg">
              {/* Artistic line accent */}
              <div className="absolute -left-4 top-0 bottom-0 w-[2px] bg-accent-red" />
              <h1 className="font-serif italic text-2xl md:text-3xl text-brand-dark leading-relaxed pl-4 font-normal text-balance">
                “{profile?.hero_phrase || "Entre palavras, silêncios e aquilo que permanece."}”
              </h1>
            </div>

            {/* Sub-excerpt */}
            <p className="font-serif text-brand-brown/80 text-sm leading-relaxed max-w-md">
              Um acervo vivo de histórias tecidas à mão, retratando o fluxo silencioso do cotidiano, a passagem do tempo e as miudezas da memória.
            </p>

            {/* CTA controls */}
            <div className="flex flex-wrap items-center gap-6 pt-4 font-sans text-xs uppercase tracking-widest">
              <Link
                href="#escritos-recentes"
                className="bg-brand-dark text-paper hover:bg-accent-red px-7 py-3.5 transition-colors duration-300 font-bold shadow-soft flex items-center gap-2 group"
              >
                <span>Começar a ler</span>
                <ArrowDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />
              </Link>
              <Link
                href="/sobre"
                className="group inline-flex items-center gap-1.5 text-brand-brown hover:text-accent-red font-bold relative py-1 transition-colors"
              >
                <span className="link-underline">Conhecer autora</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* Right Hero: Animated Portrait Canvas */}
          <div className="md:col-span-6 flex justify-center order-1 md:order-2">
            <div className="w-full max-w-[320px] aspect-[1/1.25] relative">
              {/* Double border background deck */}
              <div className="absolute -inset-3 border border-border/60 -rotate-2 rounded-xl pointer-events-none z-0" />
              <div className="absolute -inset-3 border border-accent-red/20 rotate-1 rounded-xl pointer-events-none z-0" />
              
              <div className="relative z-10">
                <AuthorPortraitAnimation />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. ULTIMOS TEXTOS / ASYMMETRIC ESCRITOS RECENTES */}
      <section id="escritos-recentes" className="py-24 px-6 max-w-5xl mx-auto scroll-mt-20">
        <div className="space-y-16">
          
          {/* Header styled with custom pencil ornament */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-border/80 pb-4">
            <div className="space-y-1">
              <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-brand-brown/60 font-bold block">
                Últimas publicações
              </span>
              <h2 className="font-serif text-3xl font-medium text-brand-dark flex items-center gap-2">
                <span>Escritos recentes</span>
                <span className="text-accent-red text-sm font-normal">♦</span>
              </h2>
            </div>
            
            <Link
              href="/contos"
              className="font-sans text-xs uppercase tracking-widest text-accent-red hover:text-accent-red-hover font-semibold transition-colors flex items-center gap-1 group"
            >
              <span>Ver acervo completo</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-pulse">
              <div className="md:col-span-7 h-80 bg-beige-medium rounded" />
              <div className="md:col-span-5 space-y-4">
                <div className="h-24 bg-beige-medium rounded" />
                <div className="h-24 bg-beige-medium rounded" />
              </div>
            </div>
          ) : recentPosts.length > 0 ? (
            // Asymmetrical grid
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* Left Column: Highlight Column Card (Post N. 1) */}
              <div className="lg:col-span-7 border border-border p-6 md:p-8 bg-paper hover:shadow-editorial transition-all duration-500 relative group">
                <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-accent-red" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-accent-red" />
                
                {recentPosts[0] && (
                  <article className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-sans tracking-widest uppercase text-brand-brown">
                      <span className="text-accent-red font-bold">{getTypeText(recentPosts[0].type)}</span>
                      <span>•</span>
                      <span>{new Date(recentPosts[0].published_at).toLocaleDateString("pt-BR", { month: "long", day: "numeric" })}</span>
                    </div>

                    <Link href={`/texto/${recentPosts[0].slug}`}>
                      <h3 className="font-serif text-2xl md:text-3xl font-semibold text-brand-dark leading-snug group-hover:text-accent-red transition-colors duration-300">
                        {recentPosts[0].title}
                      </h3>
                    </Link>

                    <p className="font-serif text-brand-brown/90 text-base leading-relaxed italic pt-1">
                      “{recentPosts[0].excerpt}”
                    </p>

                    <div className="pt-4 flex items-center justify-between font-sans text-xs text-brand-brown border-t border-border/40">
                      <span>Tempo de leitura: {getReadingTime(recentPosts[0].content)}</span>
                      <Link
                        href={`/texto/${recentPosts[0].slug}`}
                        className="text-accent-red font-semibold uppercase tracking-wider inline-flex items-center gap-1 group-hover:underline"
                      >
                        <span>Continuar lendo</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </article>
                )}
              </div>

              {/* Right Column: Stacked list (Posts N. 2 and N. 3) */}
              <div className="lg:col-span-5 space-y-8 divide-y divide-border/60">
                {recentPosts.slice(1, 3).map((post, idx) => (
                  <article key={post.id} className={`${idx > 0 ? "pt-8" : ""} group space-y-3`}>
                    <div className="flex items-center gap-2 text-xs font-sans tracking-widest uppercase text-brand-brown">
                      <span className="text-accent-red font-bold">{getTypeText(post.type)}</span>
                      <span>•</span>
                      <span>{new Date(post.published_at).toLocaleDateString("pt-BR", { month: "short", day: "numeric" })}</span>
                    </div>

                    <Link href={`/texto/${post.slug}`}>
                      <h4 className="font-serif text-xl font-medium text-brand-dark group-hover:text-accent-red transition-colors duration-300">
                        {post.title}
                      </h4>
                    </Link>

                    <p className="font-serif text-brand-brown/85 text-sm line-clamp-2 leading-relaxed">
                      “{post.excerpt}”
                    </p>

                    <div className="pt-1">
                      <Link
                        href={`/texto/${post.slug}`}
                        className="font-sans text-[10px] uppercase tracking-widest text-accent-red font-bold inline-flex items-center gap-1 group-hover:underline"
                      >
                        <span>Ler texto</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </article>
                ))}

                {recentPosts.length === 1 && (
                  <div className="p-8 border border-dashed border-border/80 text-center font-serif text-brand-brown italic text-sm">
                    Aguardando novos escritos...
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-border rounded text-brand-brown">
              <p className="font-serif italic text-lg">“Tudo permanece em silêncio por aqui.”</p>
            </div>
          )}
        </div>
      </section>

      {/* 3. DESTAQUE EDITORIAL (Escolha da autora) */}
      {featuredPost && (
        <section className="py-12 px-6 max-w-5xl mx-auto">
          <div className="space-y-8">
            <h2 className="font-serif text-xs uppercase tracking-widest text-brand-brown text-center font-bold">
              — Escolha da autora —
            </h2>
            <FeaturedPost post={featuredPost} />
          </div>
        </section>
      )}

      {/* 4. TRES ENTRADAS EDITORIAIS (Categorias Literárias) */}
      <section className="py-24 px-6 bg-beige-light/20 border-y border-border/60 relative">
        <div className="absolute inset-0 bg-[radial-gradient(#d9c6ac_1px,transparent_1px)] [background-size:32px_32px] opacity-5 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-brand-brown/60 font-bold block">
              Gêneros Literários
            </span>
            <h3 className="font-serif text-2xl font-medium text-brand-dark">Acervo de Obras</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Contos Block */}
            <div className="group border border-border/80 p-8 flex flex-col justify-between bg-paper hover:border-accent-red hover:shadow-editorial transition-all duration-500 min-h-[240px] relative">
              <div className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center font-serif text-xs italic text-brand-brown/30 font-bold">
                I
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-accent-red stroke-[1.5]" />
                  <span className="font-sans text-[10px] uppercase tracking-widest text-brand-dark font-bold">
                    Contos
                  </span>
                </div>
                <p className="font-serif text-[16px] text-brand-brown italic leading-relaxed">
                  “Histórias completas sobre aquilo que aconteceu, poderia ter acontecido ou talvez ainda aconteça.”
                </p>
              </div>
              <Link
                href="/contos"
                className="font-sans text-xs uppercase tracking-widest text-brand-dark hover:text-accent-red font-bold inline-flex items-center gap-1.5 transition-colors pt-4 border-t border-border/40 mt-4"
              >
                <span>Explorar contos</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Crônicas Block */}
            <div className="group border border-border/80 p-8 flex flex-col justify-between bg-paper hover:border-accent-red hover:shadow-editorial transition-all duration-500 min-h-[240px] relative">
              <div className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center font-serif text-xs italic text-brand-brown/30 font-bold">
                II
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-1.5">
                  <Scroll className="w-4 h-4 text-brand-brown stroke-[1.5]" />
                  <span className="font-sans text-[10px] uppercase tracking-widest text-brand-dark font-bold">
                    Crônicas
                  </span>
                </div>
                <p className="font-serif text-[16px] text-brand-brown italic leading-relaxed">
                  “Flagrantes reflexivos do cotidiano, congelando momentos simples que quase passam despercebidos.”
                </p>
              </div>
              <Link
                href="/cronicas"
                className="font-sans text-xs uppercase tracking-widest text-brand-dark hover:text-accent-red font-bold inline-flex items-center gap-1.5 transition-colors pt-4 border-t border-border/40 mt-4"
              >
                <span>Ler crônicas</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Poesias Block */}
            <div className="group border border-border/80 p-8 flex flex-col justify-between bg-paper hover:border-accent-red hover:shadow-editorial transition-all duration-500 min-h-[240px] relative">
              <div className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center font-serif text-xs italic text-brand-brown/30 font-bold">
                III
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-1.5">
                  <PenTool className="w-4 h-4 text-accent-red stroke-[1.5]" />
                  <span className="font-sans text-[10px] uppercase tracking-widest text-brand-dark font-bold">
                    Poesias
                  </span>
                </div>
                <p className="font-serif text-[16px] text-brand-brown italic leading-relaxed">
                  “Versos recortados e rítmicos para exprimir aquilo que não caberia de outra forma em prosa.”
                </p>
              </div>
              <Link
                href="/poesias"
                className="font-sans text-xs uppercase tracking-widest text-brand-dark hover:text-accent-red font-bold inline-flex items-center gap-1.5 transition-colors pt-4 border-t border-border/40 mt-4"
              >
                <span>Ler poesias</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 5. BIO SECTION - OVERLAPPING PAPER DESIGN */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative">
          
          {/* Decorative frame overlay */}
          <div className="absolute inset-x-0 top-0 bottom-0 bg-beige-light/10 border border-border -rotate-1 pointer-events-none" />

          {/* Left Column: Text bio details */}
          <div className="md:col-span-8 space-y-6 p-6 md:p-8 relative z-10">
            <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-accent-red font-bold">
              A Autora
            </span>
            <h2 className="font-serif text-3xl font-medium text-brand-dark">
              Natália Mello
            </h2>
            <div className="w-12 h-[1px] bg-accent-red" />
            
            <p className="font-serif text-brand-brown/95 text-lg leading-relaxed italic">
              “{profile?.short_bio || "Professora de Português e escritora. Colecionadora de miudezas cotidianas, investiga a memória e o tempo através da palavra escrita."}”
            </p>
            
            <p className="font-sans text-xs text-brand-brown/85 leading-relaxed max-w-xl">
              Nascida com o dom de enxergar poesia nas entrelinhas do cotidiano, concilia as salas de aula de Literatura e Língua Portuguesa com as páginas em branco de seu caderno de notas pessoal, sob o pseudônimo literário <strong>Eu e Moi</strong>.
            </p>

            <div className="pt-2">
              <Link
                href="/sobre"
                className="font-sans text-xs uppercase tracking-widest text-accent-red hover:text-accent-red-hover font-bold inline-flex items-center gap-1.5 transition-colors group"
              >
                <span>Conhecer biografia completa</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Photo Overlay Frame */}
          <div className="md:col-span-4 p-4 relative z-10 flex justify-center">
            <div className="border border-border p-3 bg-paper shadow-editorial w-full max-w-[220px] rotate-2">
              <div className="relative w-full aspect-[4/5] bg-beige-light/20 overflow-hidden">
                {/* Loader image cutout */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/natalia-bg.jpg"
                  alt="Natália Mello"
                  className="object-cover w-full h-full grayscale hover:grayscale-0 transition duration-500"
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </>
  );
}
