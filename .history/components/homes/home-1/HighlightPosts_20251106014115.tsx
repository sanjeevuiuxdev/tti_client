// app/(wherever)/components/homes/home-1/highlightposts.tsx
// Server Component: no "use client"
import BlogCard1 from "@/components/blog-cards/BlogCard1";
import { fetchBlogs } from "@/lib/blogs";

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

function fmtDate(iso?: string) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch { return ""; }
}
function plain(html = "", max = 120) {
  const s = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return s.length > max ? s.slice(0, max) + "…" : s;
}

// Adapt backend Blog → BlogCard1 props (expects imgSrc, id, date, author, title, category, excerpt)
function toCard(b: Blog) {
  return {
    id: b.slug,
    imgSrc: b.mainImage?.url || "",
    date: fmtDate(b.createdAt),
    author: b.postedBy || "",
    title: b.title,
    category: b.category?.name || "",
    excerpt: plain(b.contentHtml || "", 140),
  };
}

export default async function HighlightPosts() {
  // grab up to 18 highlight posts
  const blogs = await fetchBlogs({ section: "highlights", limit: 18 });
  const items = blogs.map(toCard);
  if (!items.length) return null;

  // split into 3 roughly equal columns
  const colA: any[] = [];
  const colB: any[] = [];
  const colC: any[] = [];
  items.forEach((p, i) => {
    if (i % 3 === 0) colA.push(p);
    else if (i % 3 === 1) colB.push(p);
    else colC.push(p);
  });

  return (
    <div className="section-highlight">
      <div className="tf-container">
        <div className="heading-section mb_28">
          <h3 className="title">Highlights</h3>
        </div>

        <div className="tf-grid-layout lg-col-3">
          <div className="col-feature item-grid">
            {colA.map((post) => (
              <BlogCard1 key={post.id} post={post} />
            ))}
          </div>

          <div className="col-feature item-grid">
            {colB.map((post) => (
              <BlogCard1 key={post.id} post={post} />
            ))}
          </div>

          <div className="col-feature item-grid">
            {colC.map((post) => (
              <BlogCard1 key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
