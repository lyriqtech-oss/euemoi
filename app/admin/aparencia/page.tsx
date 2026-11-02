"use client";

import { useEffect, useState } from "react";
import { Save, Check, Award } from "lucide-react";
import { db } from "@/lib/db";
import { AuthorProfile, Post } from "@/lib/mockData";
import canvasConfetti from "canvas-confetti";

export default function AdminAparencia() {
  const [profile, setProfile] = useState<AuthorProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [heroPhrase, setHeroPhrase] = useState("");
  const [pseudonym, setPseudonym] = useState("");
  const [featuredPostId, setFeaturedPostId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [profData, postsData] = await Promise.all([
          db.getProfile(),
          db.getPosts({ includeDrafts: true }),
        ]);

        setProfile(profData);
        setHeroPhrase(profData.hero_phrase);
        setPseudonym(profData.pseudonym);
        setPosts(postsData.filter((p) => p.status === "published"));

        const currentFeatured = postsData.find((p) => p.featured);
        if (currentFeatured) {
          setFeaturedPostId(currentFeatured.id);
        }
      } catch (err) {
        console.error("Erro ao carregar configurações de aparência:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaveStatus("saving");
    try {
      // 1. Update text metadata
      const updatedProfile: AuthorProfile = {
        ...profile,
        hero_phrase: heroPhrase.trim(),
        pseudonym: pseudonym.trim(),
      };
      await db.updateProfile(updatedProfile);

      // 2. Update featured post association
      if (featuredPostId) {
        // Toggle off all featured flags and set only the chosen one
        const updatedPosts = await Promise.all(
          posts.map(async (p) => {
            const isFeatured = p.id === featuredPostId;
            if (p.featured !== isFeatured) {
              return await db.savePost({ ...p, featured: isFeatured });
            }
            return p;
          })
        );
      }

      setSaveStatus("saved");
      canvasConfetti({ particleCount: 50, spread: 30, origin: { y: 0.85 } });
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch (err) {
      console.error("Erro ao salvar aparência:", err);
      setSaveStatus("idle");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-6">
        <div className="space-y-1">
          <span className="font-sans text-xs uppercase tracking-widest text-brand-brown font-semibold">
            Personalização
          </span>
          <h2 className="font-serif text-3xl font-medium text-brand-dark">Aparência do Site</h2>
        </div>

        <div className="flex items-center gap-3 font-sans text-xs">
          {saveStatus === "saving" && (
            <span className="text-brand-brown/60 animate-pulse italic">Salvando...</span>
          )}
          {saveStatus === "saved" && (
            <span className="text-green-700 flex items-center gap-1 font-semibold">
              <Check className="w-3.5 h-3.5" />
              <span>Salvo</span>
            </span>
          )}
        </div>
      </div>

      {loading ? (
        <div className="space-y-6 animate-pulse">
          <div className="h-16 bg-beige-medium w-full rounded" />
          <div className="h-32 bg-beige-medium w-full rounded" />
        </div>
      ) : (
        <form onSubmit={handleSave} className="max-w-2xl border border-border bg-paper p-6 md:p-8 space-y-6 shadow-soft relative">
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-accent-red" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-accent-red" />

          {/* Pseudonym/Signature Text */}
          <div className="space-y-2 font-sans text-xs">
            <label className="uppercase tracking-widest text-[10px] text-brand-brown font-bold block">
              Pseudônimo Principal (Logo e Rodapé)
            </label>
            <input
              type="text"
              required
              value={pseudonym}
              onChange={(e) => setPseudonym(e.target.value)}
              placeholder="Eu e Moi"
              className="w-full bg-paper border border-border px-3 py-2.5 outline-none text-brand-dark focus:border-accent-red transition-colors text-sm rounded-sm font-medium"
            />
          </div>

          {/* Tagline / Phrase do Hero */}
          <div className="space-y-2 font-sans text-xs">
            <label className="uppercase tracking-widest text-[10px] text-brand-brown font-bold block">
              Frase Principal do Hero (Home)
            </label>
            <textarea
              required
              value={heroPhrase}
              onChange={(e) => setHeroPhrase(e.target.value)}
              placeholder="Escreva a citação ou pensamento que abre o site..."
              rows={3}
              className="w-full bg-paper border border-border p-3 outline-none text-brand-dark focus:border-accent-red transition-colors text-sm rounded-sm font-serif italic leading-relaxed"
            />
          </div>

          {/* Choice of Author Highlight (Featured Post) */}
          <div className="space-y-2 font-sans text-xs">
            <label className="uppercase tracking-widest text-[10px] text-brand-brown font-bold flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-accent-red" />
              <span>Publicação em Destaque (Home)</span>
            </label>
            <p className="text-[10px] text-brand-brown/60 mb-2">
              Escolha qual dos textos já publicados será exibido no bloco de destaque principal.
            </p>
            <select
              value={featuredPostId}
              onChange={(e) => setFeaturedPostId(e.target.value)}
              className="w-full bg-paper border border-border px-3 py-2.5 outline-none text-brand-dark focus:border-accent-red transition-colors text-xs font-semibold uppercase tracking-wider"
            >
              <option value="">Selecione um texto...</option>
              {posts.map((post) => (
                <option key={post.id} value={post.id}>
                  [{post.type.toUpperCase()}] — {post.title}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-4 border-t border-border/40">
            <button
              type="submit"
              disabled={saveStatus === "saving"}
              className="bg-brand-dark hover:bg-accent-red text-paper px-6 py-3 font-sans text-xs uppercase tracking-widest font-semibold transition-colors duration-300 shadow-soft inline-flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
