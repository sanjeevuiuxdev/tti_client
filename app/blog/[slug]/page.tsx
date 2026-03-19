// app/blog/[slug]/page.tsx
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import Header1 from "@/components/headers/Header1";
import Footer1 from "@/components/footers/Footer1";
import Sidebar from "@/components/blog-single/Sidebar";
import SocialShare2 from "@/components/blog-single/SocialShare2";
import Comment from "@/components/blog-single/Comment";
import BlogCard1 from "@/components/blog-cards/BlogCard1";
import { redirect } from "next/navigation";

type Blog = {
  _id: string;
  slug: string;
  title: string;
  postedBy?: string;
  mainImage?: { url?: string };
  contentHtml: string;
  category?: { name: string; slug?: string };
  createdAt?: string;

  metaTitle?: string;
  metaDescription?: string;
  schemaMarkup?: string;
};

const API = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

async function fetchBlog(slug: string): Promise<Blog | null> {
  const r = await fetch(`${API}/api/blogs/${slug}`, { cache: "no-store" });
  if (!r.ok) return null;
  return r.json();
}

async function fetchRelated(catName?: string, catSlug?: string, currentSlug?: string) {
  const r = await fetch(`${API}/api/blogs?limit=100`, { cache: "no-store" });
  if (!r.ok) return [];
  const rows: Blog[] = await r.json();
  return rows
    .filter(
      (b) =>
        b.slug !== currentSlug &&
        (b.category?.slug === catSlug || b.category?.name === catName)
    )
    .slice(0, 4);
}

// ✅ Next 15: params is a Promise in server components
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await fetchBlog(slug);
  if (!blog) return {};

  // Redirect to localized URL; this page acts as a compatibility redirect
  // so links like `/blog/:slug` map to the language-aware route.
  const lang = blog.language || "en";
  redirect(`/${lang}/blog/${blog.slug}`);
  return {};
}


export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // This page now redirects in generateMetadata above, so we should never
  // reach this render path. Return a simple notFound fallback to be safe.
  return notFound();
}
