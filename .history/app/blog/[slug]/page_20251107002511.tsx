// app/blog/[slug]/page.tsx
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import Header1 from "@/components/headers/Header1";
import Footer1 from "@/components/footers/Footer1";
import Sidebar from "@/components/blog-single/Sidebar";
import SocialShare2 from "@/components/blog-single/SocialShare2";
import RelatedBlogs from "@/components/blog-single/RelatedBlogs";

type Blog = {
  _id: string;
  slug: string;
  title: string;
  postedBy?: string;
  mainImage?: { url?: string };
  contentHtml: string;
  category?: { name: string; slug?: string };
  createdAt?: string;
};

const API = process.env.NEXT_PUBLIC_API_BASE!;

async function getBlog(slug: string): Promise<Blog | null> {
  const r = await fetch(`${API}/api/blogs/${slug}`, { cache: "no-store" });
  if (!r.ok) return null;
  return r.json();
}

// simple related by same category (exclude current)
async function getRelated(categorySlug?: string, currentSlug?: string) {
  if (!categorySlug) return [];
  const r = await fetch(
    `${API}/api/blogs?category=${encodeURIComponent(categorySlug)}&limit=6`,
    { cache: "no-store" }
  );
  if (!r.ok) return [];
  const rows: Blog[] = await r.json();
  return rows.filter(b => b.slug !== currentSlug).slice(0, 4);
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const blog = await getBlog(params.slug);
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

export default async function Page({ params }: { params: { slug: string } }) {
  const blog = await getBlog(params.slug);
  if (!blog) return notFound();

  const related = await getRelated(blog.category?.slug, blog.slug);

  return (
    <>
      <Header1 />

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

      {/* heading-post (hero) */}
      <div className="heading-post style-1">
        <div className="tf-container">
          <div className="post-inner">
            <div className="content">
              <div className="wrap-meta-feature d-flex align-items-center">
                <span className="tag">
                  <a className="text-title text_white">
                    {blog.category?.name || "CATEGORY"}
                  </a>
                </span>
                <ul className="meta-feature fw-7 d-flex mb_16 text-body-1 mb-0 align-items-center">
                  <li>
                    {new Date(blog.createdAt || Date.now()).toLocaleDateString(
                      undefined,
                      { year: "numeric", month: "long", day: "numeric" }
                    )}
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

      {/* main content grid */}
      <div className="main-content">
        <div className="single-post style-1">
          <div className="tf-container">
            <div className="row">
              {/* left share column */}
              <div className="col-lg-2 lg-hide">
                <div className="share-bar style-1 text-center sticky-top">
                  <h5 className="mb_20">Share This Post</h5>
                  <ul className="d-grid gap_10">
                    <SocialShare2 />
                  </ul>
                </div>
              </div>

              {/* center: article + comments/form */}
              <div className="col-lg-7">
                <div className="content-inner">
                  <div className="wrap-post-details">
                    <div className="post-details">
                      {/* render HTML from the editor */}
                      <div
                        className="post-details__html"
                        dangerouslySetInnerHTML={{ __html: blog.contentHtml }}
                      />
                    </div>

                    {/* Prev/Next (optional simple) */}
                    {/* keep your existing nav if you want; omitted here to stay focused */}
                  </div>

                  {/* Comments + form block from your template */}
                  <div className="row mt_40">
                    <div className="col-lg-12">
                      {/* Your Comment component already renders the two-column (list + form) block */}
                      {/* If yours expects props, wire them here. */}
                      {/* <Comment /> */}
                    </div>
                  </div>
                </div>
              </div>

              {/* right: sidebar */}
              <div className="col-lg-3">
                <Sidebar />
              </div>
            </div>
          </div>
        </div>

        {/* related by category */}
        <RelatedBlogs
          // expects array of posts shaped like your cards
          posts={related.map((b) => ({
            id: b._id,
            title: b.title,
            author: b.postedBy || "",
            imgSrc: b.mainImage?.url || "",
            category: b.category?.name || "",
            href: `/blog/${b.slug}`,
          }))}
          title="Related Posts"
        />
      </div>

      <Footer1 parentClass="tf-container" />
    </>
  );
}
