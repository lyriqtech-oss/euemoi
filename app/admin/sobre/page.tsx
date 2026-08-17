"use client";

import { useEffect, useState } from "react";
import { Save, Check } from "lucide-react";
import { db } from "@/lib/db";
import { AuthorProfile } from "@/lib/mockData";
import canvasConfetti from "canvas-confetti";

export default function AdminSobre() {
  const [profile, setProfile] = useState<AuthorProfile | null>(null);
  const [biography, setBiography] = useState("");
  const [shortBio, setShortBio] = useState("");
  const [photo, setPhoto] = useState("");
  const [instagram, setInstagram] = useState("");
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const data = await db.getProfile();
        setProfile(data);
        setBiography(data.biography);
        setShortBio(data.short_bio);
        setPhoto(data.photo || "");
        setInstagram(data.instagram || "");
      } catch (err) {
        console.error("Erro ao carregar biografia no admin:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaveStatus("saving");
    try {
      const updatedProfile: AuthorProfile = {
        ...profile,
        biography: biography.trim(),
        short_bio: shortBio.trim(),
        photo: photo.trim(),
        instagram: instagram.trim(),
      };
      
      await db.updateProfile(updatedProfile);
      setSaveStatus("saved");
      canvasConfetti({ particleCount: 40, spread: 30, origin: { y: 0.8 } });
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch (err) {
      console.error("Erro ao salvar biografia:", err);
      setSaveStatus("idle");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-6">
        <div className="space-y-1">
          <span className="font-sans text-xs uppercase tracking-widest text-brand-brown font-semibold">
            Configurações
          </span>
          <h2 className="font-serif text-3xl font-medium text-brand-dark">Editar Biografia</h2>
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
          <div className="h-20 bg-beige-medium w-full rounded" />
          <div className="h-64 bg-beige-medium w-full rounded" />
        </div>
      ) : (
        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Biography Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Short Bio */}
            <div className="space-y-2">
              <label className="font-sans text-[10px] uppercase tracking-widest text-brand-brown font-bold block">
                Mini Biografia (Frase da Home)
              </label>
              <textarea
                value={shortBio}
                onChange={(e) => setShortBio(e.target.value)}
                placeholder="Uma breve introdução sobre você..."
                rows={3}
                required
                className="w-full bg-paper border border-border p-3 outline-none text-sm text-brand-dark focus:border-accent-red font-serif transition-colors rounded-sm"
              />
            </div>

            {/* Long Biography */}
            <div className="space-y-2">
              <label className="font-sans text-[10px] uppercase tracking-widest text-brand-brown font-bold block">
                Biografia Completa (Página Sobre)
              </label>
              <p className="font-sans text-[9px] text-brand-brown/60 mb-2">
                Separe os parágrafos com uma linha em branco. A primeira letra da biografia ganhará uma letra capitular automática.
              </p>
              <textarea
                value={biography}
                onChange={(e) => setBiography(e.target.value)}
                placeholder="Escreva sua história aqui..."
                rows={12}
                required
                className="w-full bg-paper border border-border p-3 outline-none text-sm text-brand-dark focus:border-accent-red font-serif transition-colors rounded-sm leading-relaxed"
              />
            </div>
          </div>

          {/* Right Meta Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="border border-border p-5 bg-paper space-y-4">
              <h4 className="font-serif font-medium text-base text-brand-dark border-b border-border pb-2">
                Mídias & Redes
              </h4>

              {/* Photo Input */}
              <div className="space-y-1.5 font-sans text-xs">
                <label className="uppercase tracking-widest text-[10px] text-brand-brown font-bold">
                  URL da Fotografia
                </label>
                <input
                  type="text"
                  value={photo}
                  onChange={(e) => setPhoto(e.target.value)}
                  placeholder="https://exemplo.com/nat-mello.jpg"
                  className="w-full bg-paper border border-border px-3 py-2 outline-none text-brand-dark text-xs"
                />
              </div>

              {/* Instagram Input */}
              <div className="space-y-1.5 font-sans text-xs">
                <label className="uppercase tracking-widest text-[10px] text-brand-brown font-bold">
                  Link do Instagram
                </label>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="https://instagram.com/euemoi"
                  className="w-full bg-paper border border-border px-3 py-2 outline-none text-brand-dark text-xs"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saveStatus === "saving"}
                  className="w-full bg-brand-dark hover:bg-accent-red text-paper py-2.5 font-sans text-xs uppercase tracking-widest font-semibold transition-colors duration-300 shadow-soft inline-flex justify-center items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar biografia</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
