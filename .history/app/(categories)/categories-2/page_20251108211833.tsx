import Link from "next/link";
import Header1 from "@/components/headers/Header1";
import Footer1 from "@/components/footers/Footer1";
import CategoriSlider from "@/components/features/CategoriSlider";
import Pagination from "@/components/common/Pagination";
import BlogCard4 from "@/components/blog-cards/BlogCard4";
import BlogSidebar from "@/components/features/BlogSidebar"; // ✅ added
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories 02 || Drozy - Modern Blog & Magazine React Nextjs Template",
  description: "Drozy - Modern Blog & Magazine React Nextjs Template",
};

type Blog = {
  _id: string;
  slug: string;
  title: string;
  postedBy?: string;
  mainImage?: { url?: string };
  category?: { name?: string; slug?: string };
  createdAt?: string;
  contentHtml?: string;
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const filters = await searchParams;
  const page = Number(filters.page) || 1;
  const q = (Array.isArray(filters.q) ? filters.q[0] : filters.q) || "";
  const perPage = 4;
  const API = process.env.NEXT_PUBLIC_API_BASE!;

  // Fetch all blogs
  const res = await fetch(`${API}/api/blogs`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(await res.text());
  const allBlogs: Blog[] = await res.json();

  // Search (frontend)
  const filtered = allBlogs.filter((b) =>
    q
      ? b.title.toLowerCase().includes(q.toLowerCase()) ||
        (b.contentHtml || "").toLowerCase().includes(q.toLowerCase())
      : true
  );

  // Pagination
  const totalPages = Math.ceil(filtered.length / perPage);
  const visible = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <>
      <Header1 />

      {/* breadcrumb */}
      <div className="bg-surface2-color">
        <div className="tf-container">
          <ul className="breadcrumb text-caption-1 text_on-surface-color">
            <li>
              <Link href="/" className="link">
                Home
              </Link>
            </li>
            <li>Categories</li>
            <li>Life Style</li>
          </ul>
        </div>
      </div>

      {/* page title */}
      {/* <div className="page-title style-default">
        <div className="tf-container">
          <div className="title d-flex align-items-center gap_16">
            <h1 className="mb_12">Life Style</h1>
            <span className="tag text-caption-1 black-on-dark text_white">
              {filtered.length} article{filtered.length === 1 ? "" : "s"}
            </span>
          </div>
          <p>
            Your destination for discovering new ways to enhance your lifestyle
            from mindful living and travel <br /> adventures to style, wellness, and
            beyond.
          </p>
        </div>
      </div> */}

      <div className="main-content">
        <div className="list-features-post sw-layout pt-0 tf-spacing-1">
          <div className="tf-container">
            {/* top slider */}
            {/* <CategoriSlider /> */}

            {/* Search box (frontend only) */}
            <div className="mobile_show"> 
              <form action="/categories-2" method="get" className="mb_24 d-flex gap_8">
                <input
                  name="q"
                  defaultValue={q}
                  placeholder="Search articles..."
                  className="tf-input"
                  style={{ minWidth: 260 }}
                />
                <button className="tf-btn" type="submit">
                  Search
                </button>
              </form>
            </div>

            <div className="row">
              <div className="col-lg-9">
                {/* Blog list */}
                <div>
                  {visible.length ? (
                    visible.map((post) => <BlogCard4 post={post as any} key={post._id} />)
                  ) : (
                    <p>No articles found.</p>
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <ul className="wg-pagination d-flex gap_12">
                    <Pagination pages={totalPages} currentPage={page} />
                  </ul>
                )}
              </div>

              {/* ✅ Real sidebar */}
              <div className="col-lg-3">
                <div className="desktop_show">
                <form action="/categories-2" method="get" className="mb_24 d-flex gap_8">
              <input
                name="q"
                defaultValue={q}
                placeholder="Search articles..."
                className="tf-input"
                style={{ minWidth: 260 }}
              />
              <button className="tf-btn" type="submit">
                Search
              </button>
            </form>
                </div>
                <BlogSidebar />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer1 />

      <style>{`
      @
      .desktop_show{display:none}
      `}</style>
    </>
  );
}

