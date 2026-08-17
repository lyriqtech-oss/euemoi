"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Scroll, PenTool, FileEdit, Trash2, Eye, Plus, Search, Filter } from "lucide-react";
import { db } from "@/lib/db";
import { Post } from "@/lib/mockData";
import canvasConfetti from "canvas-confetti";

export default function AdminPublicacoes() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const loadData = async () => {
    try {
      setLoading(true);
      const allPosts = await db.getPosts({ includeDrafts: true });
      setPosts(allPosts);
      setFilteredPosts(allPosts);
    } catch (err) {
      console.error("Erro ao buscar publicações:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle live client filtering
  useEffect(() => {
    let result = [...posts];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.name.toLowerCase().includes(q))
      );
    }

    if (typeFilter !== "all") {
      result = result.filter((p) => p.type === typeFilter);
    }

    if (statusFilter !== "all") {
      result = result.filter((p) => p.status === statusFilter);
    }

    setFilteredPosts(result);
  }, [searchQuery, typeFilter, statusFilter, posts]);

  const handleToggleStatus = async (post: Post) => {
    const nextStatus = post.status === "published" ? "draft" : "published";
    try {
      await db.savePost({
        ...post,
        status: nextStatus,
        published_at: nextStatus === "published" ? new Date().toISOString() : post.published_at,
      });

      if (nextStatus === "published") {
        canvasConfetti({ particleCount: 50, spread: 35, origin: { y: 0.85 } });
      }

      loadData();
    } catch (err) {
      console.error("Erro ao alternar status do post:", err);
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
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-6">
        <div className="space-y-1">
          <span className="font-sans text-xs uppercase tracking-widest text-brand-brown font-semibold">
            Gerenciamento
          </span>
          <h2 className="font-serif text-3xl font-medium text-brand-dark">Publicações</h2>
        </div>
        <div>
          <Link
            href="/admin/publicacoes/nova"
            className="inline-flex items-center gap-2 bg-brand-dark hover:bg-accent-red text-paper px-4 py-2 font-sans text-xs uppercase tracking-widest font-semibold transition-colors duration-300 shadow-soft"
          >
            <Plus className="w-4 h-4" />
            <span>Escrever texto</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-beige-light/10 border border-border/80 p-4 rounded-sm">
        {/* Search */}
        <div className="relative w-full md:max-w-xs flex items-center border border-border bg-paper px-3 py-2 rounded">
          <Search className="w-4 h-4 text-brand-brown/50 mr-2" />
          <input
            type="text"
            placeholder="Buscar por título, resumo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent outline-none font-sans text-[11px] uppercase tracking-wider text-brand-dark placeholder:text-brand-brown/40"
          />
        </div>

        {/* Category & Status Selectors */}
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto font-sans text-xs">
          <div className="flex items-center gap-1.5 text-brand-brown">
            <Filter className="w-3.5 h-3.5" />
            <span className="uppercase tracking-widest font-bold">Filtros:</span>
          </div>

          <div className="flex gap-4">
            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-paper border border-border px-2.5 py-1.5 text-brand-dark outline-none font-semibold uppercase tracking-wider text-[10px]"
            >
              <option value="all">Todos os gêneros</option>
              <option value="conto">Contos</option>
              <option value="cronica">Crônicas</option>
              <option value="poesia">Poesias</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-paper border border-border px-2.5 py-1.5 text-brand-dark outline-none font-semibold uppercase tracking-wider text-[10px]"
            >
              <option value="all">Todos os status</option>
              <option value="published">Publicados</option>
              <option value="draft">Rascunhos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 4, 5].map((n) => (
            <div key={n} className="h-12 bg-beige-medium w-full rounded" />
          ))}
        </div>
      ) : filteredPosts.length > 0 ? (
        <div className="border border-border bg-paper overflow-x-auto shadow-soft">
          <table className="w-full text-left border-collapse min-w-[700px] font-sans text-xs">
            <thead>
              <tr className="bg-beige-light/20 border-b border-border text-brand-brown uppercase tracking-wider text-[10px] font-bold">
                <th className="p-4 w-[35%]">Título</th>
                <th className="p-4 w-[15%]">Gênero</th>
                <th className="p-4 w-[15%]">Status</th>
                <th className="p-4 w-[15%]">Tags</th>
                <th className="p-4 w-[10%]">Data</th>
                <th className="p-4 w-[10%] text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredPosts.map((post) => {
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
                        className="flex items-center gap-1.5 focus:outline-none"
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
                      </button>
                    </td>

                    {/* Tags */}
                    <td className="p-4 text-brand-brown font-medium max-w-[150px] truncate">
                      {post.tags && post.tags.length > 0
                        ? post.tags.map((t) => `#${t.name}`).join(", ")
                        : "—"}
                    </td>

                    {/* Date */}
                    <td className="p-4 text-brand-brown whitespace-nowrap">{formattedDate}</td>

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
        <div className="text-center py-16 border border-dashed border-border rounded text-brand-brown p-8 bg-paper">
          <p className="font-serif italic text-base">“Nenhuma obra coincide com estes filtros.”</p>
          <p className="text-xs font-sans mt-1">Limpe os filtros de busca para ver todas as obras.</p>
        </div>
      )}
    </div>
  );
}
