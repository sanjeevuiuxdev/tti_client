"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Category = {
  _id: string;
  name: string;
  slug: string;
  postCount?: number;
};

export default function BlogSidebar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ctrl = new AbortController();
    const API = process.env.NEXT_PUBLIC_API_BASE!;
    fetch(`${API}/api/categories`, { signal: ctrl.signal })
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      })
      .then((rows: Category[]) => {
        setCategories(rows);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, []);

  return (
    <div className="sidebar">
      <div className="sidebar__item">
        <h5 className="sidebar__title">Categories</h5>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="sidebar-categories">
            {categories.length ? (
              categories.map((cat) => (
                <li
                  key={cat._id}
                  className="item d-flex align-items-center justify-content-between"
                >
                  <Link
                    className="fw-7 text-body-1 text_on-surface-color"
                    href={`/categories/${cat.slug}`}
                  >
                    {cat.name}
                  </Link>
                  {cat.postCount !== undefined && (
                    <span className="number">{cat.postCount}</span>
                  )}
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
