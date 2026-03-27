"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shirt, Wand2, Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "/closet", label: "My Closet", icon: Shirt },
    { href: "/get-dressed", label: "Get Dressed", icon: Wand2 },
  ];

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link href="/" className="logo">
          <img
            src="/logo.png"
            alt="Logo"
            className="logo-img"
            style={{ height: "28px", width: "auto", borderRadius: "4px" }}
          />
          <span className="logo-text">StyleHub</span>
        </Link>

        {/* Desktop nav */}
        <nav className="nav-links">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`nav-link ${pathname === href ? "nav-link-active" : ""}`}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Right controls */}
        <div className="nav-actions">
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <nav className="mobile-nav">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`mobile-nav-link ${pathname === href ? "nav-link-active" : ""}`}
              onClick={() => setMobileOpen(false)}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
