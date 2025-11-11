import Image from "next/image";
import Link from "next/link";

/** Accepts either:
 * - API post: {_id, slug, mainImage.url, category:{name,slug}, postedBy, createdAt, contentHtml}
 * - Seeded post: {id:number|string, imgSrc, category:string, author, date, excerpt}
 */
type AnyPost = {
  id?: string | number;
  _id?: string;
  slug?: string;
  title: string;
  // images
  imgSrc?: string;
  mainImage?: { url?: string };
  // category can be a string or an object
  category?: string | { name?: string; slug?: string };
  // meta
  date?: string;
  createdAt?: string;
  author?: string;
  postedBy?: string;
  excerpt?: string;
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
  } catch {
    return "";
  }
}

export default function BlogCard4({ post }: { post: AnyPost }) {
  // normalize inputs
  const href =
    post.slug
      ? `/blog/${post.slug}` // new API pages
      : `/single-post-1/${String(post.id ?? "")}`; // legacy demo pages

  const img =
    post.mainImage?.url || post.imgSrc || "/images/placeholder/977x550.webp";

  const catLabel =
    typeof post.category === "string"
      ? post.category
      : post.category?.name || "";

  const author = post.postedBy || post.author || "";
  const date = post.createdAt ? fmtDate(post.createdAt) : (post.date || "");

  const excerpt =
    post.excerpt ||
    (post.contentHtml
      ? post.contentHtml.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").slice(0, 160) + "…"
      : "");

  return (
    <div className="feature-post-item style-list hover-image-translate">
      <div className="img-style w-100">
        <Image
          className="lazyload w-100"
          decoding="async"
          loading="lazy"
          src={img}
          sizes="(max-width: 651px) 100vw, 651px"
          width={651}
          height={367}
          alt={post.title}
        />
        <div className="wrap-tag">
          <Link href={`/categories-1`} className="tag categories text-caption-2 text_white">
            {catLabel}
          </Link>
          <div className="tag time text-caption-2 text_white">
            <i className="icon-Timer" /> 4 Mins read
          </div>
        </div>
        <Link href={href} className="overlay-link" />
      </div>

      <div className="content">
        <div className="heading">
          <ul className="meta-feature fw-7 d-flex mb_16 text-body-1">
            <li>{date}</li>
            <li>
              <span className="text_secodary2-color">POST BY</span>{" "}
              <a className="link">{author}</a>
            </li>
          </ul>

          <h3 className="title">
            <Link href={href} className="link">
              {post.title}
            </Link>
          </h3>

          <p className="text-body-1 blog-card-4-desc">{excerpt}</p>
        </div>

        <Link href={href} className="hover-underline-link text-body-1 fw-7 text_on-surface-color">
          Read More
        </Link>
      </div>
    </div>
  );
}
