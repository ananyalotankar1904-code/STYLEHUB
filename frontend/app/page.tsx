import Link from "next/link";
import { Shirt, Wand2, Sparkles, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="hero">
      {/* Background gradient */}
      <div className="hero-bg" />

      {/* Content */}
      <p className="hero-eyebrow">✦ AI Fashion Assistant · Gen-Z Edition</p>

      <h1 className="hero-title">
        Dress <em>smarter</em>,<br />
        not harder.
      </h1>

      <p className="hero-subtitle">
        StyleHub turns your wardrobe into a personal stylist.
        Tell us the occasion and the weather — we&apos;ll craft the perfect look in seconds.
      </p>

      <div className="hero-actions">
        <Link href="/closet" className="btn-primary" style={{ width: "auto", padding: "14px 28px" }}>
          <Shirt size={18} />
          Open My Closet
        </Link>
        <Link href="/get-dressed" className="btn-outline" style={{ padding: "14px 28px" }}>
          <Wand2 size={18} />
          Get Dressed
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Stats */}
      <div className="hero-stat-row">
        <div className="hero-stat">
          <p className="hero-stat-num">16+</p>
          <p className="hero-stat-label">Starter Pieces</p>
        </div>
        <div className="hero-stat">
          <p className="hero-stat-num">3</p>
          <p className="hero-stat-label">Style Profiles</p>
        </div>
        <div className="hero-stat">
          <p className="hero-stat-num">∞</p>
          <p className="hero-stat-label">Possible Outfits</p>
        </div>
      </div>

      {/* Feature Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "12px",
          marginTop: "3rem",
          width: "100%",
          maxWidth: "700px",
        }}
      >
        {[
          {
            icon: <Shirt size={22} />,
            title: "Digital Closet",
            desc: "Catalogue every piece you own, organised by category and style.",
          },
          {
            icon: <Wand2 size={22} />,
            title: "AI Outfit Builder",
            desc: "Input your occasion and weather — get a full curated look in 3 seconds.",
          },
          {
            icon: <Sparkles size={22} />,
            title: "Style Intelligence",
            desc: "Minimal, streetwear, or formal — your wardrobe, your rules.",
          },
        ].map((f) => (
          <div
            key={f.title}
            style={{
              padding: "1.25rem",
              background: "var(--surface)",
              border: "1.5px solid var(--border)",
              borderRadius: "var(--radius)",
              textAlign: "left",
            }}
          >
            <div style={{ color: "var(--accent)", marginBottom: "0.75rem" }}>{f.icon}</div>
            <p style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: "0.4rem", color: "var(--text-primary)" }}>
              {f.title}
            </p>
            <p style={{ fontSize: "0.83rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
