"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PostEditor from "@/components/admin/PostEditor";
import { db } from "@/lib/db";
import { Post } from "@/lib/mockData";

export default function EditarPublicacao() {
  const params = useParams();
  const id = params.id as string;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      try {
        setLoading(true);
        const data = await db.getPostById(id);
        setPost(data);
      } catch (err) {
        console.error("Erro ao carregar obra para edição:", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-accent-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12 text-brand-brown">
        <p className="font-serif italic text-lg">“Esta obra não foi encontrada nos arquivos.”</p>
      </div>
    );
  }

  return <PostEditor post={post} />;
}
