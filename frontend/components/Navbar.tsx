"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shirt, Wand2, Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useState, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [username, setUsername] = useState<string>("guest");

  useEffect(() => {
    const saved = localStorage.getItem("sh-username");
    if (saved) setUsername(saved);
  }, []);

  const handleLogin = () => {
    const name = window.prompt("Enter your personal closet name (e.g. your name):", username === "guest" ? "" : username);
    if (name) {
      localStorage.setItem("sh-username", name.trim());
      setUsername(name.trim());
      window.location.reload(); // refresh to load their specific closet
    }
  };

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
        <div className="nav-actions" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button 
            onClick={handleLogin}
            className="btn-outline" 
            style={{ padding: "6px 14px", fontSize: "0.85rem", height: "auto", borderRadius: "100px" }}
          >
            {username === "guest" ? "Sign In" : `Hi, ${username}`}
          </button>

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
