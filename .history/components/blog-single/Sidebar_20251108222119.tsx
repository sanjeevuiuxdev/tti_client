"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Category = {
  _id: string;
  name: string;
  slug: string;
  postCount?: number; // optional if your /api/categories adds counts later
};

export default function Sidebar() {
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ctrl = new AbortController();
    const API = process.env.NEXT_PUBLIC_API_BASE!;
    fetch(`${API}/api/categories`, { signal: ctrl.signal })
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      })
      .then((rows: Category[]) => setCats(rows))
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, []);

  return (
    <div className="sidebar">
      {/* About Writer (unchanged) */}
      <div className="sidebar__item about text-center">
        {/* <h5 className="sidebar__title">About Writer</h5> */}
        <div className="box-author style-1 sidebar__item">
          <div className="info text-center">
            <div className="avatar mb_30">
              <Image
                alt="avatar"
                src="/images/avatar/main-avatar.jpg"
                width={400}
                height={400}
              />
            </div>
            <h4 className="mb_4">
              <a href="#" className="link">Emma Carson</a>
            </h4>
            <p className="text-body-1">Portland, Oregon, USA</p>
          </div>
          <ul className="social">
            <li className="text-title fw-7 text_on-surface-color">
              <a href="#" className="d-flex align-items-center gap_12">
                <i className="icon-FacebookLogo" />
                23k Likes
              </a>
            </li>
            <li className="text-title fw-7 text_on-surface-color">
              <a href="#" className="d-flex align-items-center gap_12">
                <i className="icon-XLogo" />
                41k Follower
              </a>
            </li>
            <li className="text-title fw-7 text_on-surface-color">
              <a href="#" className="d-flex align-items-center gap_12">
                <i className="icon-PinterestLogo" />
                32k Follower
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Categories (dynamic) */}
      <div className="sidebar__item">
        <h5 className="sidebar__title">Categories</h5>

        {loading ? (
          <p>Loading…</p>
        ) : (
          <ul className="sidebar-categories">
            {cats.length ? (
              cats.map((c) => (
                <li
                  key={c._id}
                  className="item d-flex align-items-center justify-content-between"
                >
                  <Link
                    className="fw-7 text-body-1 text_on-surface-color"
                    href={`/categories/${c.slug}`}
                  >
                    {c.name}
                  </Link>
                  {typeof c.postCount === "number" ? (
                    <span className="number">{c.postCount}</span>
                  ) : null}
                </li>
              ))
            ) : (
              <li>No categories found.</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
