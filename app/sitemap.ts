import { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://euemoi.vercel.app";

  // Static routes
  const routes = ["", "/sobre", "/contos", "/cronicas", "/poesias"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Dynamic routes from published posts
  try {
    const posts = await db.getPosts({ includeDrafts: false });
    const postUrls = posts.map((post) => ({
      url: `${baseUrl}/texto/${post.slug}`,
      lastModified: new Date(post.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    return [...routes, ...postUrls];
  } catch (error) {
    console.error("Erro ao gerar sitemap.ts:", error);
    return routes;
  }
}
