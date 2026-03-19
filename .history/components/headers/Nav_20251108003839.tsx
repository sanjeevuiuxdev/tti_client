"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { homePages } from "@/data/menu";
import { usePathname } from "next/navigation";
import { MenuItem } from "@/types/menu-item";

type Category = {
  _id: string;
  name: string;
  slug: string;
};

export default function Nav() {
  const pathname = usePathname();
  const [overlayEnabled, setOverlayEnabled] = useState(false);
  const [cats, setCats] = useState<Category[]>([]);
  const splittingLoadedRef = useRef(false);

  // load Splitting only once (CSR)
  useEffect(() => {
    let cancelled = false;
    if (splittingLoadedRef.current) return;
    const timer = setTimeout(async () => {
      try {
        const mod = await import("splitting");
        if (cancelled) return;
        const Splitting = (mod as any).default ?? (mod as any);
        Splitting();
        splittingLoadedRef.current = true;
      } catch {}
    }, 0);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  // overlay class toggle
  useEffect(() => {
    if (overlayEnabled) document.body.classList.add("menu-overlay-enabled");
    else document.body.classList.remove("menu-overlay-enabled");
  }, [overlayEnabled]);

  // fetch dynamic categories
  useEffect(() => {
    const ctrl = new AbortController();
    const API = process.env.NEXT_PUBLIC_API_BASE!;
    fetch(`${API}/api/categories`, { signal: ctrl.signal })
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      })
      .then((rows: Category[]) => setCats(rows))
      .catch(() => {});
    return () => ctrl.abort();
  }, []);

  const isMenuActive = (link: { href: string }) =>
    link.href?.split("/")[1] == pathname.split("/")[1];

  const isMenuParentActive = (menu: MenuItem[]) =>
    menu.some((elm) => isMenuActive(elm));

  const handleEnter = () => setOverlayEnabled(true);
  const handleLeave = () => setOverlayEnabled(false);

  return (
    <>
      {/* Home (simple link) */}
      <li
        className={`text-menu ${isMenuActive({ href: "/" }) ? "current-menu" : ""}`}
      >
        <Link href={`/`} className="toggle splitting">
          <span className="text" data-splitting="">
            Home
          </span>
          <span className="text" data-splitting="">
            Home
          </span>
        </Link>
      </li>

      {/* All posts (replaces Features dropdown) */}
      <li
        className={`text-menu ${isMenuActive({ href: "/categories-2" }) ? "current-menu" : ""}`}
      >
        <Link href={`/categories-2`} className="toggle splitting">
          <span className="text" data-splitting="">
            All posts
          </span>
          <span className="text" data-splitting="">
            All posts
          </span>
        </Link>
      </li>

      {/* Categories (dynamic dropdown) */}
      <li
        className="has-child text-menu"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        <a href="#" className="toggle splitting link-no-action">
          <span className="text" data-splitting="">
            Categories
          </span>
          <span className="text" data-splitting="">
            Categories
          </span>
        </a>
        <ul className="submenu">
          {cats.length ? (
            cats.map((c) => (
              <li key={c._id} className="menu-item">
                <Link href={`/categories/${c.slug}`}>{c.name}</Link>
              </li>
            ))
          ) : (
            <li className="menu-item">
              <span style={{ opacity: 0.6, padding: "8px 16px", display: "block" }}>
                Loading…
              </span>
            </li>
          )}
        </ul>
      </li>

      {/* About */}
      <li className={`text-menu ${isMenuActive({ href: "/about" }) ? " current-menu" : ""}`}>
        <Link href={`/about`} className="toggle splitting">
          <span className="text" data-splitting="">
            About
          </span>
          <span className="text" data-splitting="">
            About
          </span>
        </Link>
      </li>

      {/* Contact */}
      <li className={`text-menu ${isMenuActive({ href: "/contact" }) ? " current-menu" : ""}`}>
        <Link href={`/contact`} className="toggle splitting">
          <span className="text" data-splitting="">
            Contact
          </span>
          <span className="text" data-splitting="">
            Contact
          </span>
        </Link>
      </li>
    </>
  );
}
