"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

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
  } catch {
    return "";
  }
}
function plain(html = "", max = 140) {
  const s = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return s.length > max ? s.slice(0, max) + "…" : s;
}

export default function EditorsPic() {
  const [mainPost, setMainPost] = useState<Blog | null>(null);
  const [sidePosts, setSidePosts] = useState<Blog[]>([]);

  useEffect(() => {
    const ctrl = new AbortController();
    const base = process.env.NEXT_PUBLIC_API_BASE!;
    fetch(`${base}/api/blogs?section=editors_pick&limit=4`, { signal: ctrl.signal })
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      })
      .then((rows: Blog[]) => {
        setMainPost(rows[0] || null);
        setSidePosts(rows.slice(1, 4));
      })
      .catch(() => {});
    return () => ctrl.abort();
  }, []);

  if (!mainPost) return null;

  return (
    <div className="section-editor-pick">
      <div className="tf-container">
        <div className="heading-section mb_27">
          <h3>Editor Pick&apos;s</h3>
        </div>

        <div className="row wrap">
          {/* LEFT — Big Post */}
          <div className="col-lg-6">
            <div className="feature-post-item style-default hover-image-translate item-grid">
              {mainPost.mainImage?.url && (
                <div className="img-style mb_28">
                  <Image
                    className="lazyload"
                    decoding="async"
                    loading="lazy"
                    sizes="(max-width: 885px) 100vw, 885px"
                    width={885}
                    height={664}
                    alt={mainPost.title}
                    src={mainPost.mainImage.url}
                  />
                  <div className="wrap-tag">
                    <Link
                      href={`/categories-1`}
                      className="tag categories text-caption-2 text_white"
                    >
                      {mainPost.category?.name || ""}
                    </Link>
                    <div className="tag time text-caption-2 text_white">
                      <i className="icon-Timer" /> 4 Mins read
                    </div>
                  </div>
                  <Link
                    href={`/blog/${mainPost.slug}`}
                    className="overlay-link"
                  />
                </div>
              )}

              <div className="content">
                <ul className="meta-feature fw-7 d-flex text-body-1 mb_16">
                  <li>{fmtDate(mainPost.createdAt)}</li>
                  <li>
                    <span className="text_secodary2-color">POST BY</span>
                    <a href="#" className="link">
                      {mainPost.postedBy || ""}
                    </a>
                  </li>
                </ul>
                <h2 className="title mb_20">
                  <Link
                    href={`/blog/${mainPost.slug}`}
                    className="link line-clamp-2"
                  >
                    {mainPost.title}
                  </Link>
                </h2>
                <p className="text-body-1 mb_28 line-clamp-2">
                  {plain(mainPost.contentHtml || "", 200)}
                </p>
                <Link
                  href={`/single-post-1/${mainPost.slug}`}
                  className="hover-underline-link text-body-1 fw-7 text_on-surface-color"
                >
                  Read More Post
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT — 3 List Posts */}
          <div className="col-lg-6">
            {sidePosts.map((post) => (
              <div
                className="feature-post-item style-list v2 hover-image-translate mb_20"
                key={post._id}
              >
                <div className="img-style">
                  {post.mainImage?.url && (
                    <Image
                      className="lazyload"
                      decoding="async"
                      loading="lazy"
                      width={400}
                      height={300}
                      alt={post.title}
                      src={post.mainImage.url}
                    />
                  )}
                  <div className="wrap-tag">
                    <Link
                      href={`/categories-1`}
                      className="tag categories text-caption-2 text_white"
                    >
                      {post.category?.name || ""}
                    </Link>
                    <div className="tag time text-caption-2 text_white">
                      <i className="icon-Timer" /> 4 Mins read
                    </div>
                  </div>
                  <Link
                    href={`/blog/${mainPost.slug}`}
                    className="overlay-link"
                  />
                </div>

                <div className="content">
                  <ul className="meta-feature fw-7 d-flex mb_12 text-caption-2 text-uppercase">
                    <li>{fmtDate(post.createdAt)}</li>
                    <li>
                      <span className="text_secodary2-color">POST BY</span>
                      <a href="#" className="link">
                        {post.postedBy || ""}
                      </a>
                    </li>
                  </ul>
                  <h5 className="title mb_16">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="link line-clamp-2"
                    >
                      {post.title}
                    </Link>
                  </h5>
                  <p className="text-body-1 line-clamp-2">
                    {plain(post.contentHtml || "", 140)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
