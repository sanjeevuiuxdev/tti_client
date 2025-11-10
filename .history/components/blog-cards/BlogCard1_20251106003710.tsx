// Server Component: no "use client"
import BlogCard1 from "@/components/blog-cards/BlogCard1";
import { fetchBlogs } from "@/lib/blogs";

type Blog = {
  _id: string;
  title: string;
  slug: string;
  postedBy?: string;
  mainImage?: { url?: string };
  category?: { name: string; slug: string };
  createdAt?: string;
  contentHtml?: string;
};

// tiny helper: strip HTML for a short excerpt
function plain(text = "", max = 120) {
  const s = text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return s.length > max ? s.slice(0, max) + "…" : s;
}

// format a readable date string
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

// Adapt backend Blog → BlogCard1 expected props
function toCardPost(b: Blog) {
  return {
    id: b.slug,                            // BlogCard1 links use `id`; give it the slug
    imgSrc: b.mainImage?.url || "",        // ✅ BlogCard1 reads `imgSrc`
    category: b.category?.name || "",
    author: b.postedBy || "",
    date: fmtDate(b.createdAt),
    title: b.title,
    excerpt: plain(b.contentHtml || "", 140),
  };
}

export default async function LatestPosts() {
  // only the section you want on this block
  const blogs = await fetchBlogs({ section: "latest_posts", limit: 6 });
  const items = blogs.map(toCardPost);

  if (!items.length) return null;

  return (
    <div className="tf-container tf-spacing-1">
      <div className="heading-section mb_28">
        <h3 className="title">Latest Posts</h3>
      </div>

      <div className="tf-grid-layout xxl-col-4 sm-col-2">
        {items.map((post) => (
          <BlogCard1 key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
