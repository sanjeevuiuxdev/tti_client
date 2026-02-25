import GlobalEffectsProvider from "@/components/common/GlobalEffectsProvider";
import "../public/scss/main.scss";
import SearchModal from "@/components/modals/SearchModal";
import MobileMenu from "@/components/modals/MobileMenu";
import ScrollTop from "@/components/common/ScrollTop";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="alternate" href="https://example.com/es-es" hreflang="es-ES" />
      </head>
      <body>
        <div id="wrapper">{children}</div>
        <SearchModal />
        <MobileMenu />
        <ScrollTop />
        <GlobalEffectsProvider />
      </body>
    </html>
  );
}
