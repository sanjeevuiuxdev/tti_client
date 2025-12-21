"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Category = {
  _id: string;
  name: string;
  slug: string;
  postCount?: number;
};

type PopularTag = {
  tag: string;
  count: number;
};

export default function Sidebar() {
  const API = process.env.NEXT_PUBLIC_API_BASE!;

  const [cats, setCats] = useState<Category[]>([]);
  const [tags, setTags] = useState<PopularTag[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);

  // ✅ Fetch categories
  useEffect(() => {
    const ctrl = new AbortController();

    fetch(`${API}/api/categories`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((rows: Category[]) => setCats(rows))
      .catch(() => setCats([]))
      .finally(() => setLoadingCats(false));

    return () => ctrl.abort();
  }, [API]);

  // ✅ Fetch popular tags
  useEffect(() => {
    const ctrl = new AbortController();

    fetch(`${API}/api/blogs/popular?limit=12`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((res) => {
        if (Array.isArray(res)) setTags(res);
        else setTags([]);
      })
      .catch(() => setTags([]));

    return () => ctrl.abort();
  }, [API]);

  return (
    <div className="sidebar">
      {/* Categories */}
      <div className="sidebar__item">
        <h5 className="sidebar__title">Categories</h5>

        {loadingCats ? (
          <p>Loading…</p>
        ) : (
          <ul className="sidebar-categories">
            {cats.length ? (
              cats.map((c) => (
                <li
                  key={c._id}
                  className="item d-flex align-items-center justify-content-between fw-7 "
                >
                  <Link href={`/categories/${c.slug}`}>{c.name}</Link>
                  {typeof c.postCount === "number" && (
                    <span className="number">{c.postCount}</span>
                  )}
                </li>
              ))
            ) : (
              <li>No categories found.</li>
            )}
          </ul>
        )}
      </div>

      {/* Popular Tags */}
      <div className="sidebar__item">
        <h5 className="sidebar__title">Popular Tag</h5>

        <div className="sidebar-tags">
          {tags.map((t) => (
            <span key={t.tag} className="tag-pill">
              {t.tag.replace(/-/g, " ")}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
