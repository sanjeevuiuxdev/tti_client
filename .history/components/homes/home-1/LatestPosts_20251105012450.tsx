import Image from "next/image";
import Link from "next/link";
import { getJSON } from "@/lib/api";
import type { BlogPost } from "@/types/blog-post";

export default async function LatestPosts() {
  const blogs = await getJSON<BlogPost[]>("/api/public/blogs"); // published only

  if (!blogs.length) return null;

  return (
    <section className="latest-posts">
      <div className="section-head"><h2>Latest Posts</h2></div>
      <div className="grid">
        {blogs.slice(0, 6).map((b) => (
          <article key={b._id} className="card">
            {b.mainImage?.url && (
              <Link href={`/blog/${b.slug}`}>
                <Image src={b.mainImage.url} alt={b.title} width={640} height={360} />
              </Link>
            )}
            <div className="meta">
              {b.category && (
                <Link href={`/category/${b.category.slug}`} className="chip">{b.category.name}</Link>
              )}
            </div>
            <h3><Link href={`/blog/${b.slug}`}>{b.title}</Link></h3>
            {b.postedBy && <p className="by">By {b.postedBy}</p>}
          </article>
        ))}
      </div>
    </section>
  );
}
