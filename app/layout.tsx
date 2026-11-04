import type { Metadata } from "next";
import "../styles/globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/motion/CartDrawer";
import CursorGlow from "@/components/ui/CursorGlow";
import ToastContainer from "@/components/ui/ToastContainer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import BackToTop from "@/components/ui/BackToTop";
import CookieConsent from "@/components/ui/CookieConsent";
import NewsletterModal from "@/components/ui/NewsletterModal";

export const metadata: Metadata = {
  title: "PRINCE — Luxury Streetwear | Rule Without Speaking",
  description: "Rule Without Speaking. Discover the PRINCE cinematic luxury streetwear collection, featuring heavyweight craftsmanship and minimalist design.",
  metadataBase: new URL("https://prince-streetwear.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-bg-primary text-text-primary antialiased min-h-screen flex flex-col font-sans">
        <CursorGlow />
        <AnnouncementBar />
        <Navbar />
        <main className="flex-1">{children}</main>
        <CartDrawer />
        <ToastContainer />
        <BackToTop />
        <CookieConsent />
        <NewsletterModal />
        <Footer />
      </body>
    </html>
  );
}
