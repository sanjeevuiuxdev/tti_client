import Image from "next/image";
import Link from "next/link";

// Accept either the old demo BlogPost or your API Blog
type AnyPost = {
  // demo props
  id?: string;
  imgSrc?: string;
  author?: string;
  date?: string;
  excerpt?: string;
  category?: string | { name?: string; slug?: string };

  // api props
  _id?: string;
  slug?: string;
  title: string;
  postedBy?: string;
  mainImage?: { url?: string };
  createdAt?: string;
  contentHtml?: string;
};

export default function BlogCard4({ post }: { post: AnyPost }) {
  // normalize fields
  const slug = post.slug ?? post.id ?? "";
  const img =
    post.mainImage?.url ??
    post.imgSrc ??
    ""; // leave empty => no image tag rendered

  const author = post.postedBy ?? post.author ?? "";
  const date = post.date ?? fmtDate(post.createdAt);
  const title = post.title;
  const excerpt =
    post.excerpt ?? plain(post.contentHtml || "", 220);

  // category can be string or object
  const categoryName =
    typeof post.category === "string"
      ? post.category
      : post.category?.name || "";
  const categorySlug =
    typeof post.category === "string"
      ? undefined
      : post.category?.slug;

  const blogHref = slug ? `/blog/${slug}` : "#";
  const catHref = categorySlug ? `/categories/${categorySlug}` : `/categories-1`;

  return (
    <div className="feature-post-item style-list hover-image-translate">
      <div className="img-style w-100">
        {img ? (
          <Image
            className="lazyload w-100"
            decoding="async"
            loading="lazy"
            src={img}
            sizes="(max-width: 651px) 100vw, 651px"
            width={651}
            height={367}
            alt={title}
          />
        ) : null}

        <div className="wrap-tag">
          <Link href={catHref} className="tag categories text-caption-2 text_white">
            {categoryName}
          </Link>
          <div className="tag time text-caption-2 text_white">
            <i className="icon-Timer" /> 4 Mins read
          </div>
        </div>

        <Link href={blogHref} className="overlay-link" />
      </div>

      <div className="content">
        <div className="heading">
          <ul className="meta-feature fw-7 d-flex mb_16 text-body-1">
            <li>{date}</li>
            <li>
              <span className="text_secodary2-color">POST BY</span>{" "}
              <a href="#" className="link">
                {author}
              </a>
            </li>
          </ul>

          <h3 className="title">
            <Link href={blogHref} className="link">
              {title}
            </Link>
          </h3>

          {excerpt ? <p className="text-body-1 blog-card-4-desc">{excerpt}</p> : null}
        </div>

        <Link href={blogHref} className="hover-underline-link text-body-1 fw-7 text_on-surface-color">
          Read More
        </Link>
      </div>
    </div>
  );
}

// helpers
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

function plain(html = "", max = 140) {
  const s = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return s.length > max ? s.slice(0, max) + "…" : s;
}
