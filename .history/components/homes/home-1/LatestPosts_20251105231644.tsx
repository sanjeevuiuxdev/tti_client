// Server Component: no "use client"
import BlogCard1 from "@/components/blog-cards/BlogCard1";
import NewsLetterForm from "@/components/common/NewsLetterForm";
import { fetchBlogs } from "@/lib/blogs"; // ✅ this replaces getJSON

type Blog = {
  _id: string;
  title: string;
  slug: string;
  postedBy?: string;
  mainImage?: { url?: string };
  category?: { name: string; slug: string };
  createdAt?: string;
};

// convert backend Blog -> BlogCard1 props
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
  // ✅ fetch only blogs tagged "latest_posts"
  const blogs = await fetchBlogs({ section: "latest_posts", limit: 6 });

  const items = blogs.map(toCardPost);

  return (
    <div className="tf-container tf-spacing-1">
      <div className="heading-section mb_28">
        <h3 className="title">Latest Posts</h3>
      </div>

      <div className="tf-grid-layout xxl-col-4 sm-col-2">
        {items.map((post) => (
          <BlogCard1 key={post.id} post={post} />
        ))}

        {/* optional newsletter block */}
        {/* <div className="newsletter-item d-flex flex-column justify-content-between">
          <h4 className="mb_20">Subscribe Now To Stay Updated With Top News!</h4>
          <NewsLetterForm />
        </div> */}
      </div>
    </div>
  );
}
