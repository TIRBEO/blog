import { supabase } from "./supabase";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  author_name: string;
  author_avatar_url: string | null;
  cover_image_url: string | null;
  tags: string[];
  published_at: string;
  created_at: string;
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });
  return (data as BlogPost[]) ?? [];
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  return data as BlogPost | null;
}
