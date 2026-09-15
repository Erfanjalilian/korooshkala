"use client";

import { useState } from "react";
import DesktopHeader from "@/app/components/header/DesktopHeader";
import MobileHeader from "@/app/components/header/MobileHeader";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E5E7EB] bg-white">
      <DesktopHeader />

      <MobileHeader
        isMenuOpen={mobileMenuOpen}
        onMenuToggle={() => setMobileMenuOpen((prev) => !prev)}
      />
    </header>
  );
}