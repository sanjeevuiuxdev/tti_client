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

type PopularTag = {
  tag: string;
  count: number;
};

export default function Sidebar() {
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [tags, setTags] = useState<PopularTag[]>([]);

  useEffect(() => {
    const ctrl = new AbortController();
    const API = process.env.NEXT_PUBLIC_API_BASE!;
    fetch(`${API}/api/categories`, { signal: ctrl.signal })
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      })
      .then((rows: Category[]) => setCats(rows))
      .catch(() => { })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, []);


  // tags useeffect

  useEffect(() => {
    const ctrl = new AbortController();
    const API = process.env.NEXT_PUBLIC_API_BASE!;

    // fetch(`${API}/api/tags/popular?limit=12`, { signal: ctrl.signal })
    fetch(`${API}/api/blogs/popular?limit=12`, { signal: ctrl.signal })

      .then(r => r.json())
      .then(setTags)
      .catch(() => { });

    return () => ctrl.abort();
  }, []);

  return (
    <div className="sidebar">


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
