// app/blog/[slug]/page.tsx
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Script from "next/script";

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

// ------- helpers -------
async function fetchBlog(slug: string): Promise<Blog | null> {
  const r = await fetch(`${API}/api/blogs/${slug}`, { cache: "no-store" });
  if (!r.ok) return null;
  return r.json();
}

// We fetch a chunk then filter by category locally (your backend list route
// doesn’t support ?category yet).
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

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const blog = await fetchBlog(params.slug);
  if (!blog) return {};
  return {
    title: `${blog.title} || Drozy - Modern Blog & Magazine`,
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

// ------- page -------
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const blog = await fetchBlog(params.slug);
  if (!blog) return notFound();

  const related = await fetchRelated(
    blog.category?.name,
    blog.category?.slug,
    blog.slug
  );

  return (
    <>
      <Header1 />
      {/* JSON-LD (from backend textarea) */}
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
            <li>
              <Link href="/" className="link">Home</Link>
            </li>
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

      {/* main grid (keeps template layout) */}
      <div className="main-content">
        <div className="single-post style-1">
          <div className="tf-container">
            <div className="row">
              {/* left share */}
              <div className="col-lg-2 lg-hide">
                <div className="share-bar style-1 text-center sticky-top">
                  <h5 className="mb_20">Share This Post</h5>
                  <ul className="d-grid gap_10">
                    <SocialShare2 />
                  </ul>
                </div>
              </div>

              {/* center column: article + comments */}
              <div className="col-lg-7">
                <div className="content-inner">
                  <div className="wrap-post-details">
                    <div className="post-details">
                      <div
                        className="post-details__html"
                        dangerouslySetInnerHTML={{ __html: blog.contentHtml }}
                      />
                    </div>
                    {/* COMMENTS + FORM (from your template) */}
                  <Comment postId={blog._id}/>
                  </div>

                  
                </div>
              </div>

              {/* right sidebar */}
              <div className="col-lg-3">
                <Sidebar />
              </div>
            </div>
          </div>
        </div>

        {/* Related Posts (dynamic by category) */}
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
