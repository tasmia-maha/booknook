"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideNavbar = ["/login", "/register"].includes(pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}

      <main>{children}</main>

      {!hideNavbar && (
        <div className="site-footer">
          <Footer />
        </div>
      )}
    </>
  );
}