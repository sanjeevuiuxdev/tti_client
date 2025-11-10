// app/categories/page.tsx  (or wherever you want the "All Blogs" listing)
import Link from "next/link";
import Image from "next/image";

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

type Category = {
  _id: string;
  name: string;
  slug: string;
};

export const metadata = {
  title: "All Blogs",
  description: "Browse all articles with search and categories",
};

function fmtDate(iso?: string) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function strip(html = "", max = 150) {
  const s = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return s.length > max ? s.slice(0, max) + "…" : s;
}

function buildQS(q: Record<string, string | number | undefined>) {
  const u = new URLSearchParams();
  Object.entries(q).forEach(([k, v]) => {
    if (v !== undefined && v !== "") u.set(k, String(v));
  });
  return u.toString() ? `?${u.toString()}` : "";
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const q = (Array.isArray(sp.q) ? sp.q[0] : sp.q) || "";            // search text
  const cat = (Array.isArray(sp.cat) ? sp.cat[0] : sp.cat) || "";    // category slug
  const page = Math.max(1, Number(Array.isArray(sp.page) ? sp.page[0] : sp.page) || 1);
  const perPage = 6;

  const API = process.env.NEXT_PUBLIC_API_BASE!;

  // pull everything once (simple + robust with your current controller)
  const [blogsRes, catsRes] = await Promise.all([
    fetch(`${API}/api/blogs`, { next: { revalidate: 60 } }),
    fetch(`${API}/api/categories`, { next: { revalidate: 300 } }),
  ]);
  if (!blogsRes.ok) throw new Error(await blogsRes.text());
  if (!catsRes.ok) throw new Error(await catsRes.text());

  const allBlogs: Blog[] = await blogsRes.json();
  const categories: Category[] = await catsRes.json();

  // filter on the server (still "frontend" UX; no extra roundtrips needed)
  const filtered = allBlogs
    .filter((b) => (cat ? b.category?.slug === cat : true))
    .filter((b) =>
      q
        ? (b.title?.toLowerCase().includes(q.toLowerCase()) ||
           (b.contentHtml || "").toLowerCase().includes(q.toLowerCase()))
        : true
    )
    .sort((a, b) => {
      const da = new Date(a.createdAt || 0).getTime();
      const db = new Date(b.createdAt || 0).getTime();
      return db - da;
    });

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const items = filtered.slice(start, start + perPage);

  return (
    <>
      {/* Header */}
      {/* If you prefer your global Header component, keep it */}
      {/* <Header1 /> */}

      {/* breadcrumb */}
      <div className="bg-surface2-color">
        <div className="tf-container">
          <ul className="breadcrumb text-caption-1 text_on-surface-color">
            <li><Link href="/" className="link">Home</Link></li>
            <li>Blogs</li>
            {cat ? <li>{categories.find(c=>c.slug===cat)?.name || "Category"}</li> : null}
          </ul>
        </div>
      </div>

      {/* page title */}
      <div className="page-title style-default">
        <div className="tf-container">
          <div className="title d-flex align-items-center gap_16">
            <h1 className="mb_12">{cat ? categories.find(c=>c.slug===cat)?.name : "All Blogs"}</h1>
            <span className="tag text-caption-1 black-on-dark text_white">
              {total} article{total === 1 ? "" : "s"}
            </span>
          </div>
          <p>Browse the latest articles. Filter by category and search titles/content instantly.</p>
        </div>
      </div>

      <div className="main-content">
        <div className="tf-container tf-spacing-1">
          {/* Search + Categories row */}
          <div className="d-flex flex-wrap gap_12 mb_24 align-items-center justify-content-between">
            {/* GET form: keeps URL shareable and back/forward friendly */}
            <form className="d-flex gap_8" action="/categories" method="get" suppressHydrationWarning>
              <input
                name="q"
                defaultValue={q}
                placeholder="Search articles…"
                className="tf-input"
                style={{ minWidth: 260 }}
              />
              {cat ? <input type="hidden" name="cat" value={cat} /> : null}
              <button className="tf-btn" type="submit">Search</button>
            </form>

            {/* Category pills */}
            <div className="d-flex flex-wrap gap_8">
              <Link
                href={`/categories${buildQS({ q })}`}
                className={`tag ${cat ? "" : "black-on-dark text_white"}`}
              >
                All
              </Link>
              {categories.map((c) => (
                <Link
                  key={c._id}
                  href={`/categories${buildQS({ q, cat: c.slug })}`}
                  className={`tag ${cat === c.slug ? "black-on-dark text_white" : ""}`}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Grid list */}
          <div className="tf-grid-layout lg-col-3 sm-col-2">
            {items.map((b) => {
              const img = b.mainImage?.url || "/images/feature-post/thumbs-main-post-1.webp";
              return (
                <article key={b._id} className="feature-post-item style-default hover-image-translate">
                  <div className="img-style mb_20">
                    <Image
                      src={img}
                      alt={b.title}
                      width={656}
                      height={492}
                      sizes="(max-width: 656px) 100vw, 656px"
                      className="lazyload"
                    />
                    <div className="wrap-tag">
                      <Link href={`/categories${buildQS({ cat: b.category?.slug })}`}
                            className="tag categories text-caption-2 text_white">
                        {b.category?.name || "General"}
                      </Link>
                      <div className="tag time text-caption-2 text_white">
                        <i className="icon-Timer" /> {fmtDate(b.createdAt)}
                      </div>
                    </div>
                    <Link href={`/blog/${b.slug}`} className="overlay-link" />
                  </div>

                  <div className="content">
                    <ul className="meta-feature fw-7 d-flex text-caption-2 text-uppercase mb_12">
                      <li>{fmtDate(b.createdAt)}</li>
                      <li>
                        <span className="text_secodary2-color">POST BY</span>
                        <a className="link">{b.postedBy || "Author"}</a>
                      </li>
                    </ul>
                    <h5 className="title">
                      <Link href={`/blog/${b.slug}`} className="line-clamp-2 link">
                        {b.title}
                      </Link>
                    </h5>
                    <p className="text-body-1 line-clamp-2">{strip(b.contentHtml || "")}</p>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <ul className="wg-pagination d-flex gap_12 mt_28">
              {/* Prev */}
              <li className={`page-item ${page <= 1 ? "disabled" : ""}`}>
                <Link
                  className="page-link"
                  href={`/categories${buildQS({ q, cat, page: Math.max(1, page - 1) })}`}
                >
                  Prev
                </Link>
              </li>
              {/* numbers */}
              {Array.from({ length: pages }).map((_, i) => {
                const n = i + 1;
                return (
                  <li key={n} className={`page-item ${n === page ? "active" : ""}`}>
                    <Link className="page-link" href={`/categories${buildQS({ q, cat, page: n })}`}>
                      {n}
                    </Link>
                  </li>
                );
              })}
              {/* Next */}
              <li className={`page-item ${page >= pages ? "disabled" : ""}`}>
                <Link
                  className="page-link"
                  href={`/categories${buildQS({ q, cat, page: Math.min(pages, page + 1) })}`}
                >
                  Next
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>

      {/* <Footer1 /> */}
    </>
  );
}
