"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { db } from "@/lib/db";
import { AuthorProfile } from "@/lib/mockData";

export default function Sobre() {
  const [profile, setProfile] = useState<AuthorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.getProfile()
      .then((data) => {
        setProfile(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Header />

      <main className="min-h-screen pt-28 md:pt-36 pb-16 px-6 max-w-4xl mx-auto">
        {loading ? (
          <div className="space-y-8 animate-pulse mt-12">
            <div className="h-4 bg-beige-medium w-36 rounded" />
            <div className="h-10 bg-beige-medium w-80 rounded" />
            <div className="h-64 bg-beige-medium w-full rounded" />
          </div>
        ) : (
          <div className="space-y-16">
            {/* Header Area */}
            <div className="text-center md:text-left space-y-3">
              <span className="font-sans text-xs uppercase tracking-widest text-accent-red font-semibold">
                Sobre a autora
              </span>
              <h1 className="font-serif text-4xl md:text-5xl font-semibold text-brand-dark tracking-wide">
                Natália Mello
              </h1>
              <p className="font-sans text-sm uppercase tracking-widest text-brand-brown">
                Sob a marca de <span className="italic font-serif normal-case text-base text-accent-red font-semibold">Eu e Moi</span>
              </p>
              <div className="w-12 h-[1px] bg-accent-red mx-auto md:mx-0 mt-4" />
            </div>

            {/* Editorial Layout Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
              {/* Left Column: Picture and Quote */}
              <div className="md:col-span-5 space-y-8">
                <div className="border border-border p-4 bg-paper/50 shadow-editorial">
                  <div className="relative w-full aspect-[3/4] bg-beige-light/20">
                    {profile?.photo ? (
                      <Image
                        src={profile.photo}
                        alt="Natália Mello"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 300px"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center select-none">
                        <div className="font-serif italic text-brand-brown/50 text-sm">
                          Fotografia de Natália Mello
                        </div>
                        <div className="font-sans text-[10px] uppercase tracking-widest text-brand-brown/40 mt-4 border border-dashed border-border/85 px-4 py-2">
                          placeholder
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Styled Highlight Callout Quote */}
                <blockquote className="border-l-2 border-accent-red pl-5 py-2 font-serif italic text-lg text-brand-brown bg-beige-light/10 pr-2">
                  “A escrita não é sobre inventar mundos; é sobre encontrar a distância necessária para conseguir olhar para o nosso.”
                </blockquote>
              </div>

              {/* Right Column: Bio text */}
              <div className="md:col-span-7 prose-literary space-y-6 text-brand-dark text-[17px] leading-relaxed font-serif">
                {/* Biography splitting */}
                {profile?.biography ? (
                  profile.biography.split("\n\n").map((paragraph, index) => {
                    // Check if it starts with markdown bold or custom text
                    const cleanText = paragraph.replace(/\*\*/g, "");
                    
                    if (index === 0) {
                      // Apply Dropcap to first letter of first paragraph
                      const firstLetter = cleanText.charAt(0);
                      const restOfText = cleanText.slice(1);
                      return (
                        <p key={index} className="text-justify">
                          <span className="font-serif text-5xl font-medium float-left leading-[0.8] mt-1 mr-2 text-accent-red">
                            {firstLetter}
                          </span>
                          {restOfText}
                        </p>
                      );
                    }
                    return <p key={index} className="text-justify">{cleanText}</p>;
                  })
                ) : (
                  <p>Biografia não disponível.</p>
                )}
              </div>
            </div>

            {/* Extra Editorial Subsection */}
            <div className="border-t border-border/60 pt-16 grid grid-cols-1 md:grid-cols-2 gap-8 text-brand-brown">
              <div className="space-y-3">
                <h3 className="font-serif text-lg font-semibold text-accent-red uppercase tracking-wider">
                  Trajetória na Sala de Aula
                </h3>
                <p className="font-serif leading-relaxed text-sm">
                  Como professora de Língua Portuguesa, Natália dedica seus dias a decifrar a gramática do afeto e a despertar em seus alunos o amor pelas narrativas escritas. A docência alimenta sua escrita, trazendo a pulsação real da fala e das buscas da juventude.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-serif text-lg font-semibold text-accent-red uppercase tracking-wider">
                  O Nome “Eu e Moi”
                </h3>
                <p className="font-serif leading-relaxed text-sm">
                  O pseudônimo evoca a ponte entre o cotidiano prático (o “Eu”) e a voz literária íntima, reflexiva e universal (o “Moi”). Um diálogo contínuo entre a pessoa física que leciona e a escritora que recolhe fragmentos do tempo.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
