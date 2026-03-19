"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Nav from "./Nav";
import DarkModeToggler from "./DarkModeToggler";
import { FaFacebookF, FaInstagram, FaPinterestP, FaTwitter, FaYoutube } from "react-icons/fa";

export default function Header1() {
  const [isFixed, setIsFixed] = useState(false);
  const [willFixed, setWillFixed] = useState(false);

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY >= 260) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
      if (window.scrollY >= 210) {
        setWillFixed(true);
      } else {
        setWillFixed(false);
      }
    }

    window.addEventListener("scroll", handleScroll);

    // Cleanup on unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <header className="bg-surface-color">
      {/* topbar */}
      <div className="topbar">
        <div className="tf-container">
          <div className="topbar-inner d-flex justify-content-between align-items-center">
          <ul className="tf-social d-flex">
  <li>
    <a href="https://www.facebook.com/..." aria-label="facebook">
      <FaFacebookF />
    </a>
  </li>
  <li>
    <a href="https://x.com/luxholidayindia" aria-label="x/twitter">
      <FaTwitter />
    </a>
  </li>
  <li>
    <a href="https://uk.pinterest.com/traveltourindia/" aria-label="pinterest">
      <FaPinterestP />
    </a>
  </li>
  <li>
    <a href="https://www.instagram.com/tti.tours73/" aria-label="instagram">
      <FaInstagram />
    </a>
  </li>
  <li>
    <a href="https://www.youtube.com/@tti.tours73" aria-label="youtube">
      <FaYoutube />
    </a>
  </li>
</ul>
            <Link href={`/`} className="site-logo">
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
                src="/images/logo/logo-dark.png"
              />
            </Link>
            <div className="wrap d-flex justify-content-end">
              <DarkModeToggler />
              <Link
                href={`/contact`}
                className="tf-btn style-2 btn-switch-text animate-hover-btn md-hide"
              >
                <span>
                  <span className="btn-double-text" data-text="Let's Talk!">
                    Let's Talk!
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* End topbar */}
      {/* header-menu */}
      <div
        className={`header-menu style-default ${isFixed ? "is-fixed" : ""} ${
          willFixed ? "header-fixed" : ""
        } `}
      >
        <div className="tf-container">
          <div className="header-inner d-flex justify-content-between align-items-center">
            <div
              className="mobile-button d-lg-none"
              data-bs-toggle="offcanvas"
              data-bs-target="#menu-mobile"
              aria-controls="menu-mobile"
            >
              <div className="burger">
                <span />
                <span />
                <span />
              </div>
            </div>
            <nav className="main-menu lg-hide">
              <ul className="navigation">
                <Nav />
              </ul>
            </nav>
            {/* <a
              className="btn-find link-no-action"
              href="#canvasSearch"
              data-bs-toggle="offcanvas"
            >
              <i className="icon-search" />
            </a> */}
          </div>
        </div>
      </div>
      {/* End header-menu */}

      {/* End header-menu */}
    </header>
  );
}
