"use client";

import Link from "next/link";
import { Post } from "@/lib/mockData";
import { ArrowRight } from "lucide-react";

interface FeaturedPostProps {
  post: Post;
}

export default function FeaturedPost({ post }: FeaturedPostProps) {
  const formattedDate = new Date(post.published_at).toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const getReadingTime = (content: string) => {
    const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    const mins = Math.ceil(words / 200);
    return `${mins} min de leitura`;
  };

  const getTypeText = (type: string) => {
    return type === "cronica" ? "Crônica" : type === "conto" ? "Conto" : "Poesia";
  };

  return (
    <div className="border border-border/80 p-8 md:p-12 relative overflow-hidden bg-beige-light/10">
      {/* Editorial corner ticks */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-accent-red" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-accent-red" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-accent-red" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-accent-red" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Editorial Text */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-sans text-brand-brown">
            <span className="bg-accent-red text-paper px-2 py-0.5 font-medium rounded-sm">
              Destaque
            </span>
            <span>{getTypeText(post.type)}</span>
            <span>•</span>
            <span>{formattedDate}</span>
          </div>

          <h3 className="font-serif text-3xl md:text-4xl font-semibold tracking-wide text-brand-dark leading-tight">
            {post.title}
          </h3>

          <div className="border-l border-accent-red pl-4 italic font-serif text-[17px] text-brand-brown/90 leading-relaxed max-w-2xl py-1">
            “{post.excerpt}”
          </div>

          <div className="font-sans text-xs text-brand-brown">
            Tempo aproximado: {getReadingTime(post.content)}
          </div>
        </div>

        {/* CTA Area */}
        <div className="lg:col-span-4 flex justify-start lg:justify-end">
          <Link
            href={`/texto/${post.slug}`}
            className="group inline-flex items-center gap-3 bg-brand-dark text-paper hover:bg-accent-red px-6 py-3.5 transition-colors duration-300 shadow-soft"
          >
            <span className="font-sans text-xs uppercase tracking-widest font-semibold">
              Ler texto completo
            </span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
