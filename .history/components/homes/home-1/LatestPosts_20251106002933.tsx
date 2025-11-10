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
};

// Convert backend blog format → BlogCard1 props
function toCardPost(b: Blog) {
  const imageUrl = b.mainImage?.url || "";
  return {
    id: b._id,
    slug: b.slug,
    href: `/blog/${b.slug}`,
    title: b.title,
    author: b.postedBy || "",
    createdAt: b.createdAt,
    category: b.category?.name,
    categorySlug: b.category?.slug,
    img: imageUrl,
    image: imageUrl,
    thumb: imageUrl,
  };
}

export default async function LatestPosts() {
  // ✅ fetch only blogs with "latest_posts" tag
  const blogs = await fetchBlogs({ section: "latest_posts", limit: 6 });
  const items = blogs.map(toCardPost);

  if (!items.length) return null; // hide block if no blogs

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
