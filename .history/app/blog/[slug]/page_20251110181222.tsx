// app/blog/[slug]/page.tsx
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
// import { notFound } from "next/navigation"; // use after debugging

import Header1 from "@/components/headers/Header1";
import Footer1 from "@/components/footers/Footer1";
import Sidebar from "@/components/blog-single/Sidebar";
import SocialShare2 from "@/components/blog-single/SocialShare2";
import Comment from "@/components/blog-single/Comment";
import BlogCard1 from "@/components/blog-cards/BlogCard1";

type Blog = {
  _id: string;
  slug: string;
  title: string;
  postedBy?: string;
  mainImage?: { url?: string };
  contentHtml: string;
  category?: { name: string; slug?: string };
  createdAt?: string;
  schemaMarkup?: string;
};

const API = process.env.NEXT_PUBLIC_API_BASE!;
function apiBase() {
  if (!API || !/^https?:\/\//.test(API)) {
    console.error("NEXT_PUBLIC_API_BASE is missing/invalid:", API);
  }
  return API?.replace(/\/+$/, "");
}

// ---------- robust fetchers ----------
async function fetchBlog(slug: string): Promise<Blog | null> {
  const base = apiBase();
  const safe = encodeURIComponent(slug);

  // 1) Try /api/blogs/:slug
  try {
    const r1 = await fetch(`${base}/api/blogs/${safe}`, { cache: "no-store" });
    if (r1.ok) return await r1.json();
    if (r1.status !== 404) {
      console.warn("blogs/:slug returned", r1.status);
    }
  } catch (e) {
    console.warn("blogs/:slug failed", e);
  }

  // 2) Try /api/blogs?slug=…
  try {
    const r2 = await fetch(`${base}/api/blogs?slug=${safe}`, { cache: "no-store" });
    if (r2.ok) {
      const data = await r2.json();
      if (Array.isArray(data) && data.length) return data[0] as Blog;
      if (data && data.slug) return data as Blog;
    }
  } catch (e) {
    console.warn("blogs?slug= failed", e);
  }

  // 3) Fallback: list & filter
  try {
    const r3 = await fetch(`${base}/api/blogs?limit=100`, { cache: "no-store" });
    if (r3.ok) {
      const rows = (await r3.json()) as Blog[];
      const hit = rows.find((b) => b.slug === slug);
      if (hit) return hit;
    }
  } catch (e) {
    console.warn("blogs list fallback failed", e);
  }

  console.warn("No blog found for slug:", slug);
  return null;
}

async function fetchRelated(catName?: string, catSlug?: string, currentSlug?: string) {
  const base = apiBase();
  try {
    const r = await fetch(`${base}/api/blogs?limit=100`, { cache: "no-store" });
    if (!r.ok) return [];
    const rows: Blog[] = await r.json();
    return rows
      .filter(
        (b) =>
          b.slug !== currentSlug &&
          (b.category?.slug === catSlug || b.category?.name === catName)
      )
      .slice(0, 4);
  } catch {
    return [];
  }
}

// ---------- metadata ----------
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const blog = await fetchBlog(params.slug);
  if (!blog) return { title: "Article not found" };
  return {
    title: blog.title,
    description: blog.category?.name || "Blog article",
    openGraph: {
      title: blog.title,
      description: blog.category?.name || "Blog article",
      type: "article",
      url: `/blog/${blog.slug}`,
      images: blog.mainImage?.url ? [blog.mainImage.url] : undefined,
    },
  };
}

// ---------- page ----------
export default async function Page({ params }: { params: { slug: string } }) {
  const blog = await fetchBlog(params.slug);

  // For now, show a friendly message instead of 404 so you can see logs.
  if (!blog) {
    return (
      <>
        <Header1 />
        <div className="tf-container" style={{ padding: "64px 0" }}>
          <h1>Article not found</h1>
          <p>
            Slug: <code>{params.slug}</code>
          </p>
          <p>Check <code>NEXT_PUBLIC_API_BASE</code> and that this slug exists in your backend.</p>
        </div>
        <Footer1 parentClass="tf-container" />
      </>
    );
    // When ready, switch to: notFound();
  }

  const related = await fetchRelated(
    blog.category?.name,
    blog.category?.slug,
    blog.slug
  );

  return (
    <>
      <Header1 />

      {blog.schemaMarkup ? (
        <Script
          id={`schema-${blog.slug}`}
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: blog.schemaMarkup }}
        />
      ) : null}

      {/* breadcrumb */}
      <div className="bg-surface2-color">
        <div className="tf-container">
          <ul className="breadcrumb text-caption-1 text_on-surface-color">
            <li><Link href="/" className="link">Home</Link></li>
            <li>
              <Link href="/categories-1" className="link">
                {blog.category?.name || "Category"}
              </Link>
            </li>
            <li>{blog.title}</li>
          </ul>
        </div>
      </div>

      {/* hero */}
      <div className="heading-post style-1">
        <div className="tf-container">
          <div className="post-inner">
            <div className="content">
              <div className="wrap-meta-feature d-flex align-items-center">
                <span className="tag">
                  <a className="text-title text_white">{blog.category?.name || "CATEGORY"}</a>
                </span>
                <ul className="meta-feature fw-7 d-flex mb_16 text-body-1 mb-0 align-items-center">
                  <li>
                    {new Date(blog.createdAt || Date.now()).toLocaleDateString(undefined, {
                      year: "numeric", month: "long", day: "numeric",
                    })}
                  </li>
                  <li>
                    <span className="text_secodary2-color">POST BY</span>{" "}
                    <a className="link">{blog.postedBy || "Author"}</a>
                  </li>
                </ul>
              </div>
              <h1 className="mb_20">{blog.title}</h1>
              <div className="user-post d-flex align-items-center gap_20">
                <div className="avatar">
                  <img alt="avatar" src="/images/avatar/avatar-1.jpg" width={100} height={100} />
                </div>
                <p className="fw-7">
                  <span className="text_secodary2-color">Post by</span>{" "}
                  <a className="link">{blog.postedBy || "Author"}</a>
                </p>
              </div>
            </div>

            <div className="thumbs-post">
              <Image
                className="lazyload"
                alt={blog.title}
                src={blog.mainImage?.url || "/images/feature-post/thumbs-main-post-1.webp"}
                width={1350}
                height={1013}
                style={{ maxHeight: "100vh", objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* main grid */}
      <div className="main-content">
        <div className="single-post style-1">
          <div className="tf-container">
            <div className="row">
              <div className="col-lg-2 lg-hide">
                <div className="share-bar style-1 text-center sticky-top">
                  <h5 className="mb_20">Share This Post</h5>
                  <ul className="d-grid gap_10">
                    <SocialShare2 />
                  </ul>
                </div>
              </div>

              <div className="col-lg-7">
                <div className="content-inner">
                  <div className="wrap-post-details">
                    <div className="post-details">
                      <div
                        className="post-details__html"
                        dangerouslySetInnerHTML={{ __html: blog.contentHtml }}
                      />
                    </div>

                    {/* Comments */}
                    <Comment postId={blog._id} />
                  </div>
                </div>
              </div>

              <div className="col-lg-3">
                <Sidebar />
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="tf-container sw-layout tf-spacing-8">
            <div className="heading-section mb_28">
              <h3 className="title">Related Posts</h3>
            </div>
            <div className="tf-grid-layout lg-col-3">
              {related.map((b) => (
                <BlogCard1
                  key={b._id}
                  post={{
                    id: b._id,
                    title: b.title,
                    author: b.postedBy || "",
                    category: b.category?.name || "",
                    date: new Date(b.createdAt || Date.now()).toLocaleDateString(),
                    imgSrc: b.mainImage?.url || "",
                    href: `/blog/${b.slug}`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer1 parentClass="tf-container" />
    </>
  );
}
