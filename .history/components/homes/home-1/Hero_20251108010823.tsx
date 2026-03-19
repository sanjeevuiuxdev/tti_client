"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCreative, Navigation, Pagination, Parallax } from "swiper/modules";
import Blogcard2 from "@/components/blog-cards/Blogcard2";

type Blog = {
  _id: string;
  slug: string;
  title: string;
  postedBy?: string;
  mainImage?: { url?: string };
  createdAt?: string;
  category?: { name?: string; slug?: string };
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

// map API → Blogcard2 props
function toCard2(b: Blog) {
  return {
    id: b.slug,
    slug: b.slug,
    imgSrc: b.mainImage?.url || "",
    date: fmtDate(b.createdAt),
    author: b.postedBy || "",
    title: b.title,
  };
}

export default function Hero() {
  const [topNew, setTopNew] = useState<any[]>([]);
  const [banners, setBanners] = useState<Blog[]>([]);

  useEffect(() => {
    const ctrl = new AbortController();
    const base = process.env.NEXT_PUBLIC_API_BASE!;

    // Fetch both sections in parallel
    Promise.all([
      fetch(`${base}/api/blogs?section=top_new&limit=12`, { signal: ctrl.signal })
        .then(async (r) => (r.ok ? r.json() : []))
        .then((rows) => setTopNew(rows.map(toCard2)))
        .catch(() => []),

      fetch(`${base}/api/blogs?section=banner&limit=6`, { signal: ctrl.signal })
        .then(async (r) => (r.ok ? r.json() : []))
        .then((rows) => setBanners(rows))
        .catch(() => []),
    ]);

    return () => ctrl.abort();
  }, []);

  return (
    <div className="page-title homepage-1 sw-layout">
      <div className="tf-container">
        {/* TOP NEW slider */}
        <Swiper
          className="swiper wrap-feature"
          spaceBetween={15}
          breakpoints={{
            0: { slidesPerView: 1 },
            575: { slidesPerView: 2 },
            768: { slidesPerView: 3, spaceBetween: 24 },
            992: { slidesPerView: 3, spaceBetween: 24 },
            1200: { slidesPerView: 4, spaceBetween: 60 },
          }}
          modules={[Pagination]}
          pagination={{ clickable: true, el: ".spd3" }}
        >
          {topNew.map((post, idx) => (
            <SwiperSlide className="swiper-slide" key={post.id || idx}>
              <Blogcard2 post={post} />
            </SwiperSlide>
          ))}

          <div className="sw-dots sw-pagination-layout mt_24 justify-content-center d-flex mt_22 spd3" />
        </Swiper>

        {/* Banner slider */}
        <Swiper
          className="swiper sw-single animation-sl"
          modules={[EffectCreative, Parallax, Navigation, Pagination]}
          parallax
          effect="creative"
          creativeEffect={{
            prev: { shadow: true, translate: [0, 0, -400] },
            next: { translate: ["100%", 0, 0] },
          }}
          pagination={{ clickable: true, el: ".spd4" }}
          navigation={{ prevEl: ".snbp4", nextEl: ".snbn4" }}
        >
          {banners.length > 0 ? (
            banners.map((b) => (
              <SwiperSlide className="swiper-slide" key={b._id}>
                <div className="hero-banner style-default">
                  <div className="img-thumbs">
                    <Image
                      width={1800}
                      height={700}
                      alt={b.title}
                      src={b.mainImage?.url || "/placeholder-1800x700.jpg"}
                      priority
                    />
                    <Link href={`/blog/${b.slug}`} className="overlay-link" />
                  </div>
                  <div
                    className="content cs-entry__content"
                    data-swiper-parallax="-400"
                    data-swiper-parallax-duration="800"
                  >
                    <div className="content__top d-flex justify-content-between">
                      <Link
                        href={`/categories/${b.category?.slug || ""}`}
                        className="tag categories text-title text_white"
                      >
                        {b.category?.name || "Banner"}
                      </Link>
                      <div className="tag time text-title text_white">
                        <i className="icon-Timer" /> {fmtDate(b.createdAt)}
                      </div>
                    </div>
                    <div className="content__body">
                      <h1 className="text_white mb_24 line-clamp-2">
                        <Link
                          href={`/blog/${b.slug}`}
                          className="hover-line-text text_white"
                        >
                          {b.title}
                        </Link>
                      </h1>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))
          ) : (
            // fallback placeholder
            <SwiperSlide className="swiper-slide" key="placeholder">
              <div className="hero-banner style-default">
                <div className="img-thumbs">
                  <Image
                    width={1800}
                    height={700}
                    alt="page-title"
                    src="/placeholder-1800x700.jpg"
                    priority
                  />
                  <Link href="#" className="overlay-link" />
                </div>
                <div
                  className="content cs-entry__content"
                  data-swiper-parallax="-400"
                  data-swiper-parallax-duration="800"
                >
                  <div className="content__top d-flex justify-content-between">
                    <span className="tag categories text-title text_white">
                      Banner
                    </span>
                    <div className="tag time text-title text_white">
                      <i className="icon-Timer" /> —
                    </div>
                  </div>
                  <div className="content__body">
                    <h1 className="text_white mb_24">Your banner goes here</h1>
                    <p className="text_white line-clamp-2">
                      Replace with dynamic banner later.
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          )}

          <div className="sw-button style-1 sw-single-prev md-hide snbp4">
            <i className="icon-CaretLeft" />
          </div>
          <div className="sw-button style-1 sw-single-next md-hide snbn4">
            <i className="icon-CaretRight" />
          </div>
          <div className="sw-dots sw-pagination-single justify-content-center d-flex d-md-none spd4" />
        </Swiper>
      </div>
    </div>
  );
}
