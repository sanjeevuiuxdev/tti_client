// app/blog/[slug]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type Blog = {
  _id: string;
  slug: string;
  title: string;
  postedBy?: string;
  mainImage?: { url?: string };
  category?: { name?: string; slug?: string };
  contentHtml?: string;
  createdAt?: string;
  metaTitle?: string;
  metaDescription?: string;
};

const API = process.env.NEXT_PUBLIC_API_BASE!; // e.g. http://localhost:5000

async function getBlog(slug: string): Promise<Blog | null> {
  const res = await fetch(`${API}/api/blogs/${slug}`, {
    // cache a bit; tweak if you want preview-fresh
    next: { revalidate: 120 },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const blog = await getBlog(params.slug);
  if (!blog) return { title: "Not found" };
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
}

export default async function Page({ params }: { params: { slug: string } }) {
  const blog = await getBlog(params.slug);
  if (!blog) return notFound();

  return (
    <div>
      {/* breadcrumb */}
      <div className="bg-surface2-color">
        <div className="tf-container">
          <ul className="breadcrumb text-caption-1 text_on-surface-color">
            <li><Link href="/" className="link">Home</Link></li>
            <li>
              <Link href={`/categories-1`}>
                {blog.category?.name || "Category"}
              </Link>
            </li>
            <li>{blog.title}</li>
          </ul>
        </div>
      </div>

      {/* heading */}
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
            </div>

            {blog.mainImage?.url && (
              <div className="thumbs-post">
                {/* If you haven’t allowed Cloudinary in next.config, add it */}
                <Image
                  src={blog.mainImage.url}
                  alt={blog.title}
                  width={1350}
                  height={1013}
                  style={{ maxHeight: "100vh", objectFit: "contain" }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* content */}
      <div className="tf-container">
        <div className="single-post style-1">
          <div className="row">
            <div className="col-lg-10">
              <div className="content-inner">
                <div className="wrap-post-details">
                  <div
                    className="post-details"
                    // contentHtml comes from your editor — already sanitized in your admin flow
                    dangerouslySetInnerHTML={{ __html: blog.contentHtml || "" }}
                  />
                </div>
              </div>
            </div>
            {/* keep your sidebar / share bars later as needed */}
          </div>
        </div>
      </div>
    </div>
  );
}
