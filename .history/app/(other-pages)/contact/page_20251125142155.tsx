import Link from "next/link";

import Contact from "@/components/contact/Contact";
import Map from "@/components/contact/Map";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";

const contactItems = [
  {
    title: "Address:",
    lines: [
      "Mayur Vihar Phase-3",
      " Delhi, India",
    ],
  },
  {
    title: "Information:",
    lines: [
      "+91 9310054485",
      <a key="email" href="#" className="link">
        ttiworldconnect@gmail.com
      </a>,
    ],
  },
];
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Contact",
  description: "Contact",
};
export default function page() {
  return (
    <>
      <Header1 />
      <div className="bg-surface2-color">
        <div className="tf-container">
          <ul className="breadcrumb text-caption-1 text_on-surface-color">
            <li>
              <Link href={`/`} className="link">
                Home
              </Link>
            </li>
            <li>Contact Us</li>
          </ul>
        </div>
      </div>
      <div className="main-content">
        <div className="section-contact">
          <div className="tf-container tf-spacing-1">
            {/*.map */}
            <div className="map-box position-relative">
              <div id="map">
                <Map />
              </div>
            </div>
            {/*/.map */}
            <div className="row">
              <div className="col-lg-5">
                <div className="box-about">
                  <div className="heading-section mb_32">
                    <h2 className="mb_16">Let’s Work Together</h2>
                    <p>
                      We're here to listen, help, and connect. Reach out to us
                      anytime with your thoughts, questions, or suggestions.
                    </p>
                  </div>
                  <div className="list-info tf-grid-layout md-col-2">
                    {contactItems.map((item, index) => (
                      <div key={index} className="item">
                        <h5
                          className={
                            item.title === "Our Social Media:"
                              ? "mb_16"
                              : "mb_12"
                          }
                        >
                          {item.title}
                        </h5>
                        {item.lines &&
                          item.lines.map((line, i) => (
                            <p key={i} className="text-body-1">
                              {line}
                            </p>
                          ))}
                        {/* {item.socialIcons && (
                          <ul className="tf-social d-flex style-1">
                            {item.socialIcons.map((icon, i) => (
                              <li key={i}>
                                <a
                                  href={icon.href}
                                  className={icon.className}
                                />
                              </li>
                            ))}
                          </ul>
                        )} */}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-lg-6 offset-lg-1">
                <div className="heading-section mb_32">
                  <h2 className="mb_16">Drop Us A line</h2>
                  <p>Use the form below to get in touch with the sales team.</p>
                </div>
                <Contact />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer1 />
    </>
  );
}
