import Link from "next/link";
import Header1 from "@/components/headers/Header1";
import Footer1 from "@/components/footers/Footer1";
import Pagination from "@/components/common/Pagination";
import BlogCard4 from "@/components/blog-cards/BlogCard4";
import BlogSidebar from "@/components/features/BlogSidebar";

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

type Category = { _id: string; name: string; slug: string };

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [k: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const filters = await searchParams;

  const page = Number(filters.page) || 1;
  const q = (Array.isArray(filters.q) ? filters.q[0] : filters.q) || "";
  const perPage = 4;
  const API = process.env.NEXT_PUBLIC_API_BASE!;

  // Fetch categories to resolve the display name
  const catRes = await fetch(`${API}/api/categories`, { next: { revalidate: 60 } });
  if (!catRes.ok) throw new Error(await catRes.text());
  const categories: Category[] = await catRes.json();
  const activeCat = categories.find((c) => c.slug === slug) || {
    name: slug.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase()),
    slug,
    _id: "",
  };

  // Fetch all blogs then filter by category slug (keeps it simple)
  const res = await fetch(`${API}/api/blogs`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(await res.text());
  const allBlogs: Blog[] = await res.json();

  const byCategory = allBlogs.filter((b) => b.category?.slug === slug);

  // Frontend search inside this category
  const searched = byCategory.filter((b) =>
    q
      ? b.title.toLowerCase().includes(q.toLowerCase()) ||
        (b.contentHtml || "").toLowerCase().includes(q.toLowerCase())
      : true
  );

  const totalPages = Math.ceil(searched.length / perPage);
  const visible = searched.slice((page - 1) * perPage, page * perPage);

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
            <li>Categories</li>
            <li>{activeCat.name}</li>
          </ul>
        </div>
      </div>

      {/* page title */}
      <div className="page-title style-default">
        <div className="tf-container">
          <div className="title d-flex align-items-center gap_16">
            <h1 className="mb_12">{activeCat.name}</h1>
            <span className="tag text-caption-1 black-on-dark text_white">
              {searched.length} article{searched.length === 1 ? "" : "s"}
            </span>
          </div>
          {/* Optional blurb—ditch if you don't want copy here */}
          <p>
            Latest posts in <strong>{activeCat.name}</strong>.
          </p>
        </div>
      </div>

      <div className="main-content">
        <div className="list-features-post sw-layout pt-0 tf-spacing-1">
          <div className="tf-container">
            {/* Search (frontend) */}
            <form action={`/categories/${slug}`} method="get" className="mb_24 d-flex gap_8">
              <input
                name="q"
                defaultValue={q}
                placeholder="Search in this category…"
                className="tf-input"
                style={{ minWidth: 260 }}
              />
              <button className="tf-btn" type="submit">Search</button>
            </form>

            <div className="row">
              <div className="col-lg-9">
                {/* List */}
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

              {/* Sidebar */}
              <div className="col-lg-3">
                <BlogSidebar />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer1 />
    </>
  );
}
