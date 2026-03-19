"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import BlogCard1 from "@/components/blog-cards/BlogCard1";

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
function plain(html = "", max = 120) {
  const s = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return s.length > max ? s.slice(0, max) + "…" : s;
}

// map API -> BlogCard1 props
function toCard1(b: Blog) {
  return {
    id: b.slug,                             // BlogCard1 links use post.id
    imgSrc: b.mainImage?.url || "",
    category: b.category?.name || "",
    author: b.postedBy || "",
    date: fmtDate(b.createdAt),
    title: b.title,
    excerpt: plain(b.contentHtml || "", 140),
  };
}

export default function PopularBlogs() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const ctrl = new AbortController();
    const base = process.env.NEXT_PUBLIC_API_BASE!;
    fetch(`${base}/api/blogs?section=most_popular&limit=10`, { signal: ctrl.signal })
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      })
      .then((rows: Blog[]) => setItems(rows.map(toCard1)))
      .catch(() => {});
    return () => ctrl.abort();
  }, []);

  if (!items.length) return null;

  return (
    <div className="section-most-popular tf-spacing-1">
      <div className="tf-container sw-layout">
        <div className="heading-section d-flex justify-content-between mb_28">
          <h3>Most Popular</h3>
          <div className="wrap-sw-button d-flex gap_12 md-hide">
            <div className="sw-button sz-56 v2 style-cycle nav-prev-layout snbp6">
              <i className="icon-CaretLeft" />
            </div>
            <div className="sw-button sz-56 v2 style-cycle nav-next-layout snbn6">
              <i className="icon-CaretRight" />
            </div>
          </div>
        </div>

        <Swiper
          className="swiper"
          spaceBetween={15}
          breakpoints={{
            0: { slidesPerView: 1 },
            575: { slidesPerView: 2 },
            768: { slidesPerView: 3, spaceBetween: 24 },
            992: { slidesPerView: 3, spaceBetween: 40 },
            1200: { slidesPerView: 5, spaceBetween: 40 },
          }}
          modules={[Navigation, Pagination]}
          pagination={{ clickable: true, el: ".spd6" }}
          navigation={{ prevEl: ".snbp6", nextEl: ".snbn6" }}
        >
          {items.map((post) => (
            <SwiperSlide className="swiper-slide" key={post.id}>
              <BlogCard1 post={post} />
            </SwiperSlide>
          ))}
          <div className="sw-dots sw-pagination-layout mt_22 justify-content-center d-flex d-md-none spd6" />
        </Swiper>
      </div>
    </div>
  );
}
