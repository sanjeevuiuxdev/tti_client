import Image from "next/image";
import Link from "next/link";

/** Accepts either:
 * API post: {_id, slug, title, mainImage.url, category:{name,slug}, postedBy, createdAt, contentHtml}
 * Seeded post: {id:number|string, title, imgSrc, category:string, author, date, excerpt}
 */
type AnyPost = {
  // ids
  _id?: string;
  id?: string | number;
  slug?: string;

  // core
  title: string;

  // media
  imgSrc?: string;
  mainImage?: { url?: string };

  // meta
  category?: string | { name?: string; slug?: string };
  author?: string;
  postedBy?: string;
  date?: string;        // "12 Feb 2025" etc.
  createdAt?: string;   // ISO

  // body
  excerpt?: string;
  contentHtml?: string;
};

function fmtDate(iso?: string, fallback?: string) {
  if (iso) {
    try {
      return new Date(iso).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {}
  }
  return fallback || "";
}

export default function BlogCard1({ post }: { post: AnyPost }) {
  const href = post.slug
    ? `/blog/${post.slug}` // API shape
    : `/blog/${String(post.id ?? "")}`; // seeded/demo fallback

  const img =
    post.mainImage?.url || post.imgSrc || "/images/placeholder/977x550.webp";

  const catLabel =
    typeof post.category === "string"
      ? post.category
      : post.category?.name || "";

  const author = post.postedBy || post.author || "";
  const date = fmtDate(post.createdAt, post.date);

  const excerpt =
    post.excerpt ||
    (post.contentHtml
      ? post.contentHtml
          .replace(/<[^>]*>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 140) + "…"
      : "");

  return (
    <div className="feature-post-item style-default hover-image-translate">
      {img && (
        <div className="img-style mb_24">
          <Image
            className="lazyload"
            sizes="(max-width: 328px) 100vw, 328px"
            width={328}
            height={246}
            alt={post.title}
            src={img}
          />
          <div className="wrap-tag">
            {catLabel && (
              <Link
                href={`/categories-1`}
                className="tag categories text-caption-2 text_white"
              >
                {catLabel}
              </Link>
            )}
            <div className="tag time text-caption-2 text_white">
              <i className="icon-Timer" /> 4 Mins read
            </div>
          </div>
          <Link href={href} className="overlay-link" />
        </div>
      )}

      <div className="content">
        <ul className="meta-feature fw-7 d-flex text-caption-2 text-uppercase mb_12">
          {date && <li>{date}</li>}
          {author && (
            <li>
              <span className="text_secodary2-color">POST BY</span>
              <a className="link">{author}</a>
            </li>
          )}
        </ul>

        <h5 className="title">
          <Link href={href} className="line-clamp-2 link">
            {post.title}
          </Link>
        </h5>

        {excerpt && <p className="text-body-1 line-clamp-2">{excerpt}</p>}
      </div>
    </div>
  );
}
