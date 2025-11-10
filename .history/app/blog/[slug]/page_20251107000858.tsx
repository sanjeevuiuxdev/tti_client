// app/blog/[slug]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

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
  category?: { name?: string; slug?: string; _id?: string };
  contentHtml?: string;
  createdAt?: string;
  metaTitle?: string;
  metaDescription?: string;
};

const API = process.env.NEXT_PUBLIC_API_BASE!;

// ---- helpers ----
async function fetchJSON<T>(url: string, revalidate = 120): Promise<T> {
  const res = await fetch(url, { next: { revalidate } });
  if (res.status === 404) throw new Error("404");
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

function toCardPost(b: Blog) {
  const imageUrl = b.mainImage?.url || "";
  return {
    id: b._id,                 // widget may read id but we link with slug
    slug: b.slug,
    href: `/blog/${b.slug}`,
    title: b.title,
    author: b.postedBy || "",
    date: new Date(b.createdAt || "").toDateString(),
    category: b.category?.name || "",
    imgSrc: imageUrl,
    image: imageUrl,
    img: imageUrl,
    thumb: imageUrl,
  };
}

// ---- SEO ----
export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const blog = await fetchJSON<Blog>(`${API}/api/blogs/${params.slug}`, 60);
    return {
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.title,
      openGraph: {
        title: blog.metaTitle || blog.title,
        description: blog.metaDescription || blog.title,
        type: "article",
        url: `/blog/${blog.slug}`,
        images: blog.mainImage?.url ? [{ url: blog.mainImage.url }] : undefined,
      },
    };
  } catch {
    return { title: "Not found" };
  }
}

// ---- page ----
export default async function Page({ params }: { params: { slug: string } }) {
  // 1) current post
  let blog: Blog | null = null;
  try {
    blog = await fetchJSON<Blog>(`${API}/api/blogs/${params.slug}`, 60);
  } catch {
    return notFound();
  }
  if (!blog) return notFound();

  // 2) load some recent posts to compute prev/next + related
  const all = await fetchJSON<Blog[]>(`${API}/api/blogs?limit=50`, 60);

  // sort newest -> oldest
  const sorted = [...all].sort(
    (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  );
  const idx = sorted.findIndex((p) => p.slug === blog!.slug);
  const prevBlog = idx > 0 ? sorted[idx - 1] : null;
  const nextBlog = idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1] : null;

  // 3) related by category (exclude current)
  const related = sorted
    .filter(
      (p) =>
        p.slug !== blog!.slug &&
        (p.category?._id && blog!.category?._id
          ? p.category!._id === blog!.category!._id
          : p.category?.name === blog!.category?.name)
    )
    .slice(0, 6);

  return (
    <>
      <Header1 />

      {/* breadcrumb */}
      <div className="bg-surface2-color">
        <div className="tf-container">
          <ul className="breadcrumb text-caption-1 text_on-surface-color">
            <li>
              <Link href="/" className="link">Home</Link>
            </li>
            <li>
              {/* If you build a real category page later, swap the href */}
              <Link href={`/categories-1`} className="link">
                {blog.category?.name || "Category"}
              </Link>
            </li>
            <li>{blog.title}</li>
          </ul>
        </div>
      </div>

      {/* heading-post */}
      <div className="heading-post style-1">
        <div className="tf-container">
          <div className="post-inner">
            <div className="content">
              <div className="wrap-meta-feature d-flex align-items-center">
                <span className="tag">
                  <a className="text-title text_white">
                    {blog.category?.name || "General"}
                  </a>
                </span>
                <ul className="meta-feature fw-7 d-flex mb_16 text-body-1 mb-0 align-items-center">
                  <li>{new Date(blog.createdAt || "").toDateString()}</li>
                  <li>
                    <span className="text_secodary2-color">POST BY</span>{" "}
                    <a className="link">{blog.postedBy || "Admin"}</a>
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
                  <a className="link">{blog.postedBy || "Admin"}</a>
                </p>
              </div>
            </div>

            {blog.mainImage?.url && (
              <div className="thumbs-post">
                <Image
                  className="lazyload"
                  alt={blog.title}
                  src={blog.mainImage.url}
                  width={1350}
                  height={1013}
                  style={{ maxHeight: "100vh", objectFit: "contain" }}
                  priority
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* main */}
      <div className="main-content">
        <div className="single-post style-1">
          <div className="tf-container">
            <div className="row">
              {/* share bar (left) */}
              <div className="col-lg-2 lg-hide">
                <div className="share-bar style-1 text-center sticky-top">
                  <h5 className="mb_20">Share This Post</h5>
                  <ul className="d-grid gap_10">
                    <SocialShare2 />
                  </ul>
                </div>
              </div>

              {/* content + sidebar */}
              <div className="col-lg-10">
                <div className="content-inner">
                  <div className="wrap-post-details">
                    <div
                      className="post-details"
                      dangerouslySetInnerHTML={{ __html: blog.contentHtml || "" }}
                    />

                    {/* prev / next */}
                    <div className="tf-article-navigation">
                      {prevBlog ? (
                        <div className="item prev">
                          <Link
                            href={`/blog/${prevBlog.slug}`}
                            className="hover-underline-link text-body-1 text_on-surface-color fw-7 mb_12"
                          >
                            Previous
                          </Link>
                          <h6>
                            <Link href={`/blog/${prevBlog.slug}`} className="link line-clamp-2">
                              {prevBlog.title}
                            </Link>
                          </h6>
                        </div>
                      ) : null}

                      {nextBlog ? (
                        <div className="item next">
                          <Link
                            href={`/blog/${nextBlog.slug}`}
                            className="hover-underline-link text-body-1 text_on-surface-color fw-7 mb_12"
                          >
                            Next
                          </Link>
                          <h6>
                            <Link href={`/blog/${nextBlog.slug}`} className="link line-clamp-2">
                              {nextBlog.title}
                            </Link>
                          </h6>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {/* comments + sidebar (keep your existing components) */}
                  <Comment />
                  <Sidebar />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Posts by category */}
        <div className="tf-container">
          <div className="heading-section mb_28">
            <h3 className="title">Related Posts</h3>
          </div>
          <div className="tf-grid-layout xxl-col-4 sm-col-2">
            {related.map((b) => {
              const card = toCardPost(b);
              return <BlogCard1 key={b._id} post={card as any} />;
            })}
          </div>
        </div>
      </div>

      <Footer1 parentClass="tf-container" />
    </>
  );
}
