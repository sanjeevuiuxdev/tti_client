// Server Component: no "use client"
import BlogCard1 from "@/components/blog-cards/BlogCard1";
import NewsLetterForm from "@/components/common/NewsLetterForm";

// tiny server-side fetch helper (or use the one I gave earlier in /lib/api.ts)
async function getJSON<T>(path: string): Promise<T> {
  const base = process.env.NEXT_PUBLIC_API_BASE!;
  const res = await fetch(`${base}${path}`, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  return res.json();
}

type Blog = {
  _id: string;
  title: string;
  slug: string;
  postedBy?: string;
  mainImage?: { url?: string };
  category?: { name: string; slug: string };
  createdAt?: string;
};

// Adapter to be friendly with different BlogCard1 props conventions.
// It includes multiple aliases so you usually don't need to touch BlogCard1 at all.
function toCardPost(b: Blog) {
  const imageUrl = b.mainImage?.url || "";
  return {
    // common ids/links
    id: b._id,
    slug: b.slug,
    href: `/blog/${b.slug}`,

    // titles/text
    title: b.title,
    author: b.postedBy || "",

    // dates
    createdAt: b.createdAt,
    time: b.createdAt, // alias many templates use

    // category
    category: b.category?.name,
    categoryName: b.category?.name,
    cate: b.category?.name,           // alias
    categorySlug: b.category?.slug,

    // images (cover several naming styles used by card components)
    img: imageUrl,
    image: imageUrl,
    picture: imageUrl,
    thumb: imageUrl,
    imageObj: { src: imageUrl, alt: b.title },
  };
}

export default async function LatestPosts() {
  // pull all published blogs
  const blogs = await getJSON<Blog[]>("/api/blogs");

  // take the first 6 for this grid; tweak as needed
  const items = blogs.slice(0, 6).map(toCardPost);

  return (
    <div className="tf-container tf-spacing-1">
      <div className="heading-section mb_28">
        <h3 className="title">Latest Posts</h3>
      </div>

      <div className="tf-grid-layout xxl-col-4 sm-col-2">
        {items.map((post) => (
          <BlogCard1 key={post.id} post={post} />
        ))}

        {/* keep your newsletter block */}
        <div className="newsletter-item d-flex flex-column justify-content-between">
          <h4 className="mb_20">Subscribe Now To Stay Updated With Top News!</h4>
          <div>
            <NewsLetterForm />
            <div className="box-fieldset-item d-flex">
              <fieldset className="d-flex gap_12">
                <input type="checkbox" className="tf-check" />
              </fieldset>
              <p className="text-body-1">
                By clicking the Subscribe button, you acknowledge that you have read and agree to our{" "}
                <a href="#" className="text_on-surface-color link">Privacy Policy</a> and{" "}
                <a href="#" className="text_on-surface-color link">Terms Of Use</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
