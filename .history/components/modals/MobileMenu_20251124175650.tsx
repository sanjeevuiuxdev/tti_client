"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type Category = {
  _id: string;
  name: string;
  slug: string;
};

type BootstrapModule = {
  Offcanvas: {
    getOrCreateInstance: (element: Element) => {
      hide: () => void;
    };
  };
};

export default function MobileMenu() {
  const pathname = usePathname();
  const [cats, setCats] = useState<Category[]>([]);
  const hasLoadedBootstrap = useRef(false);
  const bootstrapRef = useRef<BootstrapModule | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const isMenuActive = (href: string) => {
    return href.split("/")[1] === pathname.split("/")[1];
  };

  // Load Bootstrap Offcanvas once
  useEffect(() => {
    if (typeof window === "undefined" || hasLoadedBootstrap.current) return;

    import("bootstrap/dist/js/bootstrap.esm")
      .then((module) => {
        hasLoadedBootstrap.current = true;
        bootstrapRef.current = module;
      })
      .catch((err) => console.error("Bootstrap load failed:", err));
  }, []);

  // Close menu on route change
  useEffect(() => {
    if (!bootstrapRef.current) return;

    const instance = bootstrapRef.current.Offcanvas.getOrCreateInstance(
      mobileMenuRef.current!
    );
    instance.hide();
  }, [pathname]);

  // Fetch dynamic categories
  useEffect(() => {
    const controller = new AbortController();
    const API = process.env.NEXT_PUBLIC_API_BASE!;

    fetch(`${API}/api/categories`, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((rows: Category[]) => setCats(rows))
      .catch(() => {});

    return () => controller.abort();
  }, []);

  return (
    <div
      className="offcanvas offcanvas-start mobile-nav-wrap"
      tabIndex={-1}
      id="menu-mobile"
      ref={mobileMenuRef}
      style={{back}}
    >
      <div className="offcanvas-header top-nav-mobile">
        <div className="offcanvas-title">
          <Link href="/" className="site-logo">
            <Image
              alt="logo"
              className="main-logo light-mode-logo"
              width={193}
              height={44}
              src="/images/logo/logo.png"
            />
            <Image
              alt="logo"
              className="main-logo dark-mode-logo"
              width={193}
              height={44}
              src="/images/logo/logo-dark.svg"
            />
          </Link>
        </div>
        <div data-bs-dismiss="offcanvas" className="btn-close-menu">
          <i className="icon-X" />
        </div>
      </div>

      <div className="offcanvas-body inner-mobile-nav">
        <ul id="menu-mobile-menu" className="style-1">

          {/* Home */}
          <li className={`menu-item ${isMenuActive("/") ? "active" : ""}`}>
            <Link href="/" className="item-menu-mobile">
              Home
            </Link>
          </li>

          {/* All posts */}
          <li
            className={`menu-item ${
              isMenuActive("/categories-2") ? "active" : ""
            }`}
          >
            <Link href="/categories-2" className="item-menu-mobile">
              All Posts
            </Link>
          </li>

          {/* Categories - dynamic dropdown */}
          <li className="menu-item menu-item-has-children-mobile">
            <a
              href="#dropdown-categories"
              className="item-menu-mobile collapsed"
              data-bs-toggle="collapse"
            >
              Categories
            </a>

            <div
              id="dropdown-categories"
              className="collapse"
              data-bs-parent="#menu-mobile-menu"
            >
              <ul className="sub-mobile">
                {cats.length ? (
                  cats.map((c) => (
                    <li key={c._id} className="menu-item">
                      <Link href={`/categories/${c.slug}`}>{c.name}</Link>
                    </li>
                  ))
                ) : (
                  <li className="menu-item">
                    <span style={{ opacity: 0.6 }}>Loading…</span>
                  </li>
                )}
              </ul>
            </div>
          </li>

          {/* About */}
          <li className={`menu-item ${isMenuActive("/about") ? "active" : ""}`}>
            <Link href="/about" className="item-menu-mobile">
              About
            </Link>
          </li>

          {/* Contact */}
          <li
            className={`menu-item ${isMenuActive("/contact") ? "active" : ""}`}
          >
            <Link href="/contact" className="item-menu-mobile">
              Contact
            </Link>
          </li>
        </ul>

        {/* Bottom section */}
        <div className="support">
          <Link href="/contact" className="tf-btn style-2 animate-hover-btn">
            <span>Let's Talk!</span>
          </Link>
          <a href="#" className="text-need">
            Need help?
          </a>
        </div>
      </div>
    </div>
  );
}
