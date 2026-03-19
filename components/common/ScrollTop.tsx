"use client";
import React, { useEffect, useState } from "react";

export default function ScrollTop() {
  const [scrolled, setScrolled] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(500);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // You can use 'auto' or 'instant' as well
    });
  };

  const handleScroll = () => {
    const currentScroll =
      document.body.scrollTop || document.documentElement.scrollTop;
    setScrolled(currentScroll);

    const totalScrollHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    setScrollHeight(totalScrollHeight);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`progress-wrap ${scrolled > 150 ? "active-progress" : ""}`}
      onClick={scrollToTop}
    >
      <svg
        className="progress-circle svg-content"
        width="100%"
        height="100%"
        viewBox="-1 -1 102 102"
      >
        <path
          d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"
          style={{
            strokeDasharray: "307.919, 307.919",
            transition: "none",
<<<<<<< HEAD
            strokeDashoffset: (() => {
              const C = 307.919;
              const progress = Number.isFinite(scrollHeight) && scrollHeight > 0
                ? Math.min(1, Math.max(0, scrolled / scrollHeight))
                : 0;
              const offset = C - progress * C;
              return Number.isFinite(offset) ? offset : C;
            })(),
=======
            strokeDashoffset: 307.919 - (scrolled / scrollHeight) * 307.919,
>>>>>>> f87894cb250ee7ac728329456c9610b14a9004d7
          }}
        />
      </svg>
    </div>
  );
}
