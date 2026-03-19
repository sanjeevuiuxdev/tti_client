// components/blog-cards/Blogcard2.tsx
import { BlogPost } from "@/types/blog-post";
import Image from "next/image";
import Link from "next/link";

export default function Blogcard2({ post }: { post: BlogPost }) {
  const img =
    (post as any).mainImage?.url || (post as any).imgSrc || "/images/default-thumb.webp";
  const author = (post as any).postedBy || (post as any).author || "Unknown";
  const date =
    post.createdAt
      ? new Date(post.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : (post as any).date || "";

  return (
    <div className="feature-post-item style-small d-flex align-items-center hover-image-rotate">
      <Link href={`/blog/${post.slug}`} className="img-style">
        {img && (
          <Image
            decoding="async"
            loading="lazy"
            width={123}
            height={92}
            alt={post.title || "feature"}
            src={img}
          />
        )}
      </Link>

      <div className="content">
        <ul className="meta-feature text-caption-2 fw-7 text_secodary-color d-flex align-items-center mb_8 text-uppercase">
          <li>{date}</li>
          <li>
            <a href="#" className="text-uppercase">
              {author}
            </a>
          </li>
        </ul>

        <h6 className="title">
          <Link href={`/blog/${post.slug}`} className="link line-clamp-2">
            {post.title}
          </Link>
        </h6>
      </div>
    </div>
  );
}
