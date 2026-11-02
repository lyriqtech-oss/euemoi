"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Scroll, PenTool, FileEdit, Trash2, Eye, ToggleLeft, ToggleRight } from "lucide-react";
import { db } from "@/lib/db";
import { Post } from "@/lib/mockData";
import canvasConfetti from "canvas-confetti";

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    contos: 0,
    cronicas: 0,
    poesias: 0,
    drafts: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const allPosts = await db.getPosts({ includeDrafts: true });
      setPosts(allPosts);

      // Compute statistics
      const computed = allPosts.reduce(
        (acc, post) => {
          acc.total++;
          if (post.status === "draft") acc.drafts++;
          if (post.type === "conto") acc.contos++;
          else if (post.type === "cronica") acc.cronicas++;
          else if (post.type === "poesia") acc.poesias++;
          return acc;
        },
        { total: 0, contos: 0, cronicas: 0, poesias: 0, drafts: 0 }
      );
      setStats(computed);
    } catch (err) {
      console.error("Erro ao carregar dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleStatus = async (post: Post) => {
    const nextStatus = post.status === "published" ? "draft" : "published";
    try {
      await db.savePost({
        ...post,
        status: nextStatus,
        published_at: nextStatus === "published" ? new Date().toISOString() : post.published_at,
      });
      
      if (nextStatus === "published") {
        canvasConfetti({ particleCount: 60, spread: 40, origin: { y: 0.8 } });
      }

      loadData();
    } catch (err) {
      console.error("Erro ao alterar status:", err);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Deseja realmente excluir "${title}"? Esta ação não pode ser desfeita.`)) {
      try {
        await db.deletePost(id);
        loadData();
      } catch (err) {
        console.error("Erro ao excluir post:", err);
      }
    }
  };

  const getTypeText = (type: string) => {
    return type === "cronica" ? "Crônica" : type === "conto" ? "Conto" : "Poesia";
  };

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

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-6">
        <div className="space-y-1">
          <span className="font-sans text-xs uppercase tracking-widest text-brand-brown font-semibold">
            Visão Geral
          </span>
          <h2 className="font-serif text-3xl font-medium text-brand-dark">
            Olá, Natália.
          </h2>
        </div>
        <div>
          <Link
            href="/admin/publicacoes/nova"
            className="inline-flex items-center gap-2 bg-brand-dark hover:bg-accent-red text-paper px-4 py-2 font-sans text-xs uppercase tracking-widest font-semibold transition-colors duration-300 shadow-soft"
          >
            Novo texto
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 animate-pulse">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="border border-border p-4 bg-paper h-24 rounded" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {/* Total Posts */}
          <div className="border border-border p-4 bg-paper relative overflow-hidden">
            <div className="font-sans text-[10px] uppercase tracking-widest text-brand-brown/70 font-bold mb-2">
              Publicações
            </div>
            <div className="font-serif text-3xl text-brand-dark font-semibold">{stats.total}</div>
            <div className="absolute top-0 right-0 w-2 h-2 bg-accent-red/20" />
          </div>

          {/* Contos */}
          <div className="border border-border p-4 bg-paper">
            <div className="font-sans text-[10px] uppercase tracking-widest text-brand-brown/70 font-bold mb-2 flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-accent-red" />
              <span>Contos</span>
            </div>
            <div className="font-serif text-3xl text-brand-dark font-semibold">{stats.contos}</div>
          </div>

          {/* Crônicas */}
          <div className="border border-border p-4 bg-paper">
            <div className="font-sans text-[10px] uppercase tracking-widest text-brand-brown/70 font-bold mb-2 flex items-center gap-1">
              <Scroll className="w-3 h-3 text-brand-brown" />
              <span>Crônicas</span>
            </div>
            <div className="font-serif text-3xl text-brand-dark font-semibold">{stats.cronicas}</div>
          </div>

          {/* Poesias */}
          <div className="border border-border p-4 bg-paper">
            <div className="font-sans text-[10px] uppercase tracking-widest text-brand-brown/70 font-bold mb-2 flex items-center gap-1">
              <PenTool className="w-3 h-3 text-accent-red" />
              <span>Poesias</span>
            </div>
            <div className="font-serif text-3xl text-brand-dark font-semibold">{stats.poesias}</div>
          </div>

          {/* Drafts */}
          <div className="border border-border p-4 bg-paper">
            <div className="font-sans text-[10px] uppercase tracking-widest text-brand-brown/70 font-bold mb-2">
              Rascunhos
            </div>
            <div className="font-serif text-3xl text-accent-red font-semibold">{stats.drafts}</div>
          </div>
        </div>
      )}

      {/* Publications Table List */}
      <div className="space-y-4">
        <h3 className="font-serif text-xl font-medium text-brand-dark">Publicações recentes</h3>

        {loading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-10 bg-beige-medium w-full rounded" />
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="border border-border bg-paper overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px] font-sans text-xs">
              <thead>
                <tr className="bg-beige-light/20 border-b border-border text-brand-brown uppercase tracking-wider text-[10px] font-bold">
                  <th className="p-4 w-[40%]">Título</th>
                  <th className="p-4 w-[15%]">Gênero</th>
                  <th className="p-4 w-[15%]">Status</th>
                  <th className="p-4 w-[15%]">Publicado em</th>
                  <th className="p-4 w-[15%] text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {posts.slice(0, 5).map((post) => {
                  const formattedDate = new Date(post.published_at).toLocaleDateString("pt-BR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  });

                  return (
                    <tr key={post.id} className="hover:bg-beige-light/10 transition-colors">
                      {/* Title */}
                      <td className="p-4 font-serif font-medium text-sm text-brand-dark">
                        <Link
                          href={`/texto/${post.slug}`}
                          className="hover:text-accent-red transition-colors"
                        >
                          {post.title}
                        </Link>
                      </td>

                      {/* Genre */}
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-brand-brown font-semibold">
                          {getTypeIcon(post.type)}
                          <span>{getTypeText(post.type)}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleStatus(post)}
                          className="group flex items-center gap-1.5 focus:outline-none"
                          title="Clique para alternar status"
                        >
                          <span
                            className={`px-2 py-0.5 rounded-sm font-semibold uppercase text-[9px] tracking-wider ${
                              post.status === "published"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {post.status === "published" ? "Publicado" : "Rascunho"}
                          </span>
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                            {post.status === "published" ? (
                              <ToggleRight className="w-4 h-4 text-green-700" />
                            ) : (
                              <ToggleLeft className="w-4 h-4 text-yellow-700" />
                            )}
                          </span>
                        </button>
                      </td>

                      {/* Date */}
                      <td className="p-4 text-brand-brown">{formattedDate}</td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2 text-brand-brown">
                          <Link
                            href={`/texto/${post.slug}`}
                            className="p-1.5 hover:text-accent-red hover:bg-beige-light/20 transition-all rounded"
                            title="Visualizar no site"
                          >
                            <Eye className="w-4 h-4 stroke-[1.5]" />
                          </Link>
                          <Link
                            href={`/admin/publicacoes/editar/${post.id}`}
                            className="p-1.5 hover:text-accent-red hover:bg-beige-light/20 transition-all rounded"
                            title="Editar texto"
                          >
                            <FileEdit className="w-4 h-4 stroke-[1.5]" />
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id, post.title)}
                            className="p-1.5 hover:text-accent-red hover:bg-accent-red/5 transition-all rounded"
                            title="Excluir texto"
                          >
                            <Trash2 className="w-4 h-4 stroke-[1.5]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-border rounded text-brand-brown p-8 bg-paper">
            <p className="font-serif italic text-base">“Sua escrivaninha está vazia.”</p>
            <p className="text-xs font-sans mt-1">Crie sua primeira história para começar.</p>
          </div>
        )}
      </div>
    </div>
  );
}
