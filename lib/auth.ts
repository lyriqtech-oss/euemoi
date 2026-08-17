"use client";

import { isSupabaseConfigured, supabase } from "./db";

const ADMIN_MOCK_EMAIL = "admin@euemoi.com.br";
const ADMIN_MOCK_PASSWORD = "admin123";
const AUTH_TOKEN_KEY = "euemoi_admin_session";

export const auth = {
  async login(email: string, password: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return !!data.user;
    } else {
      // Mock Login
      if (email === ADMIN_MOCK_EMAIL && password === ADMIN_MOCK_PASSWORD) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem(AUTH_TOKEN_KEY, "active-mock-session-token");
        }
        return true;
      }
      return false;
    }
  },

  async logout(): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    } else {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(AUTH_TOKEN_KEY);
      }
    }
  },

  async isAuthenticated(): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.auth.getSession();
      return !!data.session;
    } else {
      if (typeof window !== "undefined") {
        return !!sessionStorage.getItem(AUTH_TOKEN_KEY);
      }
      return false;
    }
  },

  async getAdminUser(): Promise<{ email: string; name: string } | null> {
    const isAuthed = await this.isAuthenticated();
    if (!isAuthed) return null;

    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.auth.getUser();
      return data.user ? { email: data.user.email || "", name: "Natália Mello" } : null;
    } else {
      return { email: ADMIN_MOCK_EMAIL, name: "Natália Mello" };
    }
  }
};
