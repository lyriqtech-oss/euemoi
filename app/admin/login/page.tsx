"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, Eye, EyeOff, AlertCircle } from "lucide-react";
import { auth } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/db";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [forgotPasswordMsg, setForgotPasswordMsg] = useState(false);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    auth.isAuthenticated().then((authed) => {
      if (authed) {
        router.push("/admin");
      }
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const success = await auth.login(email, password);
      if (success) {
        router.push("/admin");
      } else {
        setError("E-mail ou senha incorretos.");
      }
    } catch (err: any) {
      setError(err.message || "Erro desconhecido ao tentar fazer login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-paper flex items-center justify-center p-6 relative">
      {/* Background sketch accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#d9c6ac_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

      <div className="w-full max-w-md bg-paper border border-border p-8 md:p-10 relative z-10 shadow-editorial">
        {/* Fine border accents */}
        <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t border-l border-accent-red" />
        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b border-r border-accent-red" />

        <div className="text-center space-y-3 mb-8">
          <span className="font-sans text-[10px] uppercase tracking-widest text-accent-red font-semibold">
            Área Restrita
          </span>
          <h1 className="font-serif text-3xl font-medium text-brand-dark italic">
            Eu e Moi
          </h1>
          <p className="font-sans text-[11px] text-brand-brown/80 uppercase tracking-widest">
            Painel da Autora
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-accent-red/5 border-l-2 border-accent-red text-accent-red flex items-start gap-2 text-xs font-sans">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 font-sans">
          {/* Email input */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-brand-brown font-semibold block">
              E-mail
            </label>
            <div className="relative flex items-center border border-border bg-paper focus-within:border-accent-red transition-colors p-2.5 rounded-sm">
              <Mail className="w-4 h-4 text-brand-brown/50 mr-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="natália@euemoi.com.br"
                className="w-full bg-transparent outline-none text-sm text-brand-dark placeholder:text-brand-brown/30 font-medium"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase tracking-widest text-brand-brown font-semibold">
                Senha
              </label>
              <button
                type="button"
                onClick={() => setForgotPasswordMsg(true)}
                className="text-[10px] uppercase tracking-widest text-brand-brown hover:text-accent-red transition-colors font-medium"
              >
                Esqueci a senha
              </button>
            </div>
            <div className="relative flex items-center border border-border bg-paper focus-within:border-accent-red transition-colors p-2.5 rounded-sm">
              <Lock className="w-4 h-4 text-brand-brown/50 mr-2.5" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent outline-none text-sm text-brand-dark placeholder:text-brand-brown/30 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-brand-brown/50 hover:text-accent-red transition-colors ml-2"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-dark hover:bg-accent-red text-paper transition-colors duration-300 py-3 uppercase tracking-widest text-xs font-semibold shadow-soft"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {forgotPasswordMsg && (
          <div className="mt-6 p-4 bg-beige-light/30 border border-border text-brand-brown text-xs font-sans text-center rounded">
            Para recuperar sua senha, entre em contato com o suporte ou redefina diretamente no painel do Supabase.
          </div>
        )}

        {/* Mock Credentials Helper Box - Only shown if Supabase NOT configured */}
        {!isSupabaseConfigured && (
          <div className="mt-8 border-t border-border/60 pt-6">
            <div className="p-4 bg-beige-light/20 border border-border/80 text-brand-brown text-[11px] font-sans leading-relaxed rounded">
              <p className="font-semibold text-accent-red uppercase tracking-wider mb-1">
                Modo de Testes Ativo
              </p>
              <p>O site está rodando em modo mock offline.</p>
              <p className="mt-1">
                E-mail: <code className="bg-beige-medium px-1">admin@euemoi.com.br</code>
              </p>
              <p>
                Senha: <code className="bg-beige-medium px-1">admin123</code>
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
