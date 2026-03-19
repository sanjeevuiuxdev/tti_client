"use client";
import React, { useEffect, useState, useCallback } from "react";
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

// map API -> big card props
function toBigCard(b: Blog) {
  return {
    id: b.slug,
    imgSrc: b.mainImage?.url || "",
    category: b.category?.name || "",
    date: fmtDate(b.createdAt),
    author: b.postedBy || "",
    title: b.title,
    excerpt: plain(b.contentHtml || "", 180),
    views: "",      // your template shows views/comments; omit for now
    comments: "",
  };
}

// map API -> list item props
function toListCard(b: Blog) {
  return {
    id: b.slug,
    imgSrc: b.mainImage?.url || "",
    category: b.category?.name || "",
    date: fmtDate(b.createdAt),
    author: b.postedBy || "",
    title: b.title,
    excerpt: plain(b.contentHtml || "", 120),
    hasVideo: false,
    videoURL: "",
  };
}

export default function EditorsPic() {
  const [openVideo, setOpenVideo] = useState(-1);
  const toggleVideo = useCallback((index: number) => {
    setOpenVideo((prev) => (prev === index ? -1 : index));
  }, []);

  const [big, setBig] = useState<any[]>([]);
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    const ctrl = new AbortController();
    const base = process.env.NEXT_PUBLIC_API_BASE!;
    // pull more than we need, then split
    fetch(`${base}/api/blogs?section=editors_pick&limit=12`, { signal: ctrl.signal })
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      })
      .then((rows: Blog[]) => {
        const left = rows.slice(0, 2).map(toBigCard);   // 2 big items on left
        const right = rows.slice(2, 10).map(toListCard); // up to 8 list items on right
        setBig(left);
        setList(right);
      })
      .catch(() => {});
    return () => ctrl.abort();
  }, []);

  if (!big.length && !list.length) return null;

  return (
    <div className="section-editor-pick">
      <div className="tf-container">
        <div className="heading-section mb_27">
          <h3>Editor Pick&apos;s</h3>
        </div>

        <div className="row wrap">
          {/* LEFT: big features */}
          <div className="col-lg-6">
            {big.map((post, index) => (
              <div
                className="feature-post-item style-default hover-image-translate item-grid"
                key={post.id || index}
              >
                {post.imgSrc && (
                  <div className="img-style mb_28">
                    <Image
                      className="lazyload"
                      decoding="async"
                      loading="lazy"
                      sizes="(max-width: 885px) 100vw, 885px"
                      width={885}
                      height={664}
                      alt="feature post"
                      src={post.imgSrc}
                    />
                    <div className="wrap-tag">
                      <Link
                        href={`/categories-1`}
                        className="tag categories text-caption-2 text_white"
                      >
                        {post.category}
                      </Link>
                      <div className="tag time text-caption-2 text_white">
                        <i className="icon-Timer" /> 4 Mins read
                      </div>
                    </div>
                    <Link
                      href={`/single-post-1/${post.id}`}
                      className="overlay-link"
                    />
                  </div>
                )}

                <div className="content">
                  <div className="wrap-meta d-flex justify-content-between mb_16">
                    <ul className="meta-feature fw-7 d-flex text-body-1">
                      <li>{post.date}</li>
                      <li>
                        <span className="text_secodary2-color">POST BY</span>
                        <a href="#" className="link">
                          {post.author}
                        </a>
                      </li>
                    </ul>
                    <ul className="meta-feature interact fw-7 d-flex text-body-1">
                      <li>
                        <i className="icon-Eye" />
                        {post.views}
                      </li>
                      <li>
                        <i className="icon-ChatsCircle" />
                        {post.comments}
                      </li>
                    </ul>
                  </div>

                  <h2 className="title mb_20">
                    <Link
                      href={`/single-post-1/${post.id}`}
                      className="link line-clamp-2"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-body-1 mb_28 line-clamp-2">{post.excerpt}</p>
                  <Link
                    href={`/single-post-1/${post.id}`}
                    className="hover-underline-link text-body-1 fw-7 text_on-surface-color"
                  >
                    Read More Post
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: list styles */}
          <div className="col-lg-6">
            {list.map((post, index) => (
              <div
                className="feature-post-item style-list v2 hover-image-translate"
                key={post.id || index}
              >
                <div className="img-style">
                  {post.imgSrc && (
                    <Image
                      className={`lazyload ${openVideo == index ? "hide" : ""}`}
                      decoding="async"
                      loading="lazy"
                      sizes="(max-width: 400px) 100vw, 400px"
                      width={400}
                      height={300}
                      alt="feature post"
                      src={post.imgSrc}
                    />
                  )}
                  <div className="wrap-tag">
                    <Link
                      href={`/categories-1`}
                      className="tag categories text-caption-2 text_white"
                    >
                      {post.category}
                    </Link>
                    <div className="tag time text-caption-2 text_white">
                      <i className="icon-Timer" /> 4 Mins read
                    </div>
                  </div>

                  {/* keep video controls API-compatible; your fetched posts have hasVideo=false */}
                  {post.hasVideo && (
                    <>
                      <button
                        className={`video_btn_play ${
                          openVideo == index ? "active" : ""
                        }`}
                        aria-label="Play / Pause"
                        onClick={() =>
                          toggleVideo(openVideo == index ? -1 : index)
                        }
                      >
                        {openVideo == index ? (
                          <i className="icon-pause pause" />
                        ) : (
                          <i className="icon-play-filled" />
                        )}
                        <span className="pause" />
                      </button>

                      <div
                        className="tf-video"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {openVideo == index && post.hasVideo && (
                          <iframe
                            width="860"
                            height="515"
                            src={`${post.videoURL}&autoplay=1`}
                            title="YouTube video player"
                            allow="autoplay"
                            referrerPolicy="strict-origin-when-cross-origin"
                          />
                        )}
                      </div>
                    </>
                  )}

                  <Link
                    href={`/single-post-1/${post.id}`}
                    className="overlay-link"
                  />
                </div>

                <div className="content">
                  <ul className="meta-feature fw-7 d-flex mb_12 text-caption-2 text-uppercase">
                    <li>{post.date}</li>
                    <li>
                      <span className="text_secodary2-color">POST BY</span>
                      <a href="#" className="link">
                        {post.author}
                      </a>
                    </li>
                  </ul>
                  <h5 className="title mb_16">
                    <Link
                      href={`/single-post-1/${post.id}`}
                      className="link line-clamp-2"
                    >
                      {post.title}
                    </Link>
                  </h5>
                  <p className="text-body-1 line-clamp-2">{post.excerpt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
