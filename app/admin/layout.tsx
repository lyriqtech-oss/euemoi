"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  User,
  Palette,
  LogOut,
  Menu,
  X,
  BookOpen,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // Check if the current page is the login page to prevent redirect loop
    if (pathname === "/admin/login") {
      setLoading(false);
      return;
    }

    async function checkAuth() {
      const authed = await auth.isAuthenticated();
      if (!authed) {
        router.push("/admin/login");
      } else {
        setAuthenticated(true);
      }
      setLoading(false);
    }
    checkAuth();
  }, [pathname, router]);

  // If path is login, bypass layout wrap
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await auth.logout();
    router.push("/admin/login");
  };

  const navItems = [
    { label: "Visão geral", href: "/admin", icon: LayoutDashboard },
    { label: "Publicações", href: "/admin/publicacoes", icon: FileText },
    { label: "Novo texto", href: "/admin/publicacoes/nova", icon: PlusCircle },
    { label: "Biografia", href: "/admin/sobre", icon: User },
    { label: "Aparência", href: "/admin/aparencia", icon: Palette },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center p-6">
        <div className="w-8 h-8 border-3 border-accent-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authenticated) {
    return null; // Will redirect shortly
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col md:flex-row relative">
      {/* Mobile Top Navbar */}
      <div className="md:hidden border-b border-border bg-paper/95 p-4 flex items-center justify-between z-30 sticky top-0">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-accent-red" />
          <span className="font-serif italic text-lg text-brand-dark">Eu e Moi</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 text-brand-brown hover:text-accent-red"
          aria-label="Abrir menu admin"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Sidebar Navigation - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-beige-light/20 border-r border-border p-6 justify-between select-none">
        <div className="space-y-10">
          <div className="space-y-1">
            <span className="font-sans text-[10px] uppercase tracking-widest text-accent-red font-bold">
              Escritório
            </span>
            <div className="font-serif italic text-2xl text-brand-dark tracking-wide font-semibold">
              Eu e Moi
            </div>
            <p className="font-sans text-[9px] uppercase tracking-widest text-brand-brown">
              Painel da Autora
            </p>
          </div>

          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded font-sans text-xs uppercase tracking-wider font-semibold transition-all ${
                    isActive(item.href)
                      ? "bg-brand-dark text-paper"
                      : "text-brand-brown hover:text-accent-red hover:bg-beige-light/40"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded font-sans text-xs uppercase tracking-wider font-semibold text-brand-brown hover:text-accent-red hover:bg-accent-red/5 transition-all mt-8"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-brand-dark/20 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute left-0 top-0 bottom-0 w-72 bg-paper border-r border-border p-6 flex flex-col justify-between shadow-editorial"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-10">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="font-sans text-[10px] uppercase tracking-widest text-accent-red font-bold">
                      Escritório
                    </span>
                    <div className="font-serif italic text-xl text-brand-dark">Eu e Moi</div>
                  </div>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-1 rounded-full text-brand-brown hover:text-accent-red"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="flex flex-col space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded font-sans text-xs uppercase tracking-wider font-semibold transition-all ${
                          isActive(item.href)
                            ? "bg-brand-dark text-paper"
                            : "text-brand-brown hover:text-accent-red"
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded font-sans text-xs uppercase tracking-wider font-semibold text-brand-brown hover:text-accent-red hover:bg-accent-red/5 transition-all"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <span>Sair</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Workspace */}
      <main className="flex-1 p-6 md:p-10 max-w-5xl overflow-y-auto">{children}</main>
    </div>
  );
}
