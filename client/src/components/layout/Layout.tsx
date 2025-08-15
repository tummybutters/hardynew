import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import PartnershipBanner from "./PartnershipBanner";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-800 bg-gray-50">
      <Header />
      <PartnershipBanner />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
