"use client";

import Link from "next/link";
import { Post } from "@/lib/mockData";
import { ArrowUpRight } from "lucide-react";

interface PostPreviewProps {
  post: Post;
}

export default function PostPreview({ post }: PostPreviewProps) {
  const formattedDate = new Date(post.published_at).toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const getReadingTime = (content: string) => {
    const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    const mins = Math.ceil(words / 200); // 200 words per min avg
    return `${mins} min de leitura`;
  };

  const getTypeText = (type: string) => {
    return type === "cronica" ? "Crônica" : type === "conto" ? "Conto" : "Poesia";
  };

  return (
    <article className="group border-b border-border/80 pb-8 transition-all duration-300">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3 text-xs tracking-widest uppercase font-sans text-brand-brown">
        <span className="text-accent-red font-medium">{getTypeText(post.type)}</span>
        <span className="text-border">•</span>
        <span>{formattedDate}</span>
        <span className="text-border">•</span>
        <span>{getReadingTime(post.content)}</span>
      </div>

      <Link href={`/texto/${post.slug}`} className="block group">
        <h3 className="font-serif text-2xl font-medium tracking-wide text-brand-dark group-hover:text-accent-red transition-colors duration-300 mb-3">
          {post.title}
        </h3>
      </Link>

      <p className="font-serif text-brand-brown/85 text-[15px] leading-relaxed mb-4 italic max-w-2xl line-clamp-3">
        “{post.excerpt}”
      </p>

      <div className="flex items-center gap-1.5">
        <Link
          href={`/texto/${post.slug}`}
          className="font-sans text-xs uppercase tracking-widest text-accent-red hover:text-accent-red-hover font-semibold inline-flex items-center gap-1 transition-colors duration-300"
        >
          <span>Continuar lendo</span>
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </article>
  );
}
