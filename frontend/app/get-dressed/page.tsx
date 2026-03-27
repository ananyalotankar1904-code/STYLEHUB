"use client";

import { useState, useEffect } from "react";
import GetDressedForm from "@/components/GetDressedForm";
import LoadingState from "@/components/LoadingState";
import OutfitSuggestion from "@/components/OutfitSuggestion";
import { OutfitSuggestion as OutfitSuggestionType, ClothingItem } from "@/lib/types";
import { fetchWardrobe } from "@/lib/api";
import { Wand2, Shirt } from "lucide-react";

export default function GetDressedPage() {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [wardrobeLoading, setWardrobeLoading] = useState(true);
  const [result, setResult] = useState<OutfitSuggestionType | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchWardrobe();
        setItems(data);
      } catch (err) {
        console.error("Failed to load wardrobe", err);
      } finally {
        setWardrobeLoading(false);
      }
    }
    load();
  }, []);

  const handleReset = () => setResult(null);

  return (
    <div className="page">
      {/* Header */}
      <div className="page-hero">
        <p className="page-eyebrow">✦ AI Outfit Builder</p>
        <h1 className="page-title">
          {result ? "Your Look" : "Get Dressed"}
        </h1>
        <p className="page-subtitle">
          {result
            ? "Curated from your wardrobe, styled for the moment."
            : "Tell us the vibe — we'll handle the rest."}
        </p>
      </div>

      {/* States */}
      {loading || wardrobeLoading ? (
        <LoadingState />
      ) : result ? (
        <OutfitSuggestion suggestion={result} onReset={handleReset} />
      ) : items.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "4rem 2rem",
          background: "var(--surface)",
          border: "2px dashed var(--border)",
          borderRadius: "var(--radius-lg)",
          color: "var(--text-secondary)"
        }}>
          <Shirt size={48} style={{ marginBottom: "1rem", color: "var(--accent)" }} />
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem", color: "var(--text-primary)" }}>
            Closet is empty
          </h2>
          <p style={{ marginBottom: "1.5rem" }}>Upload some clothes to get AI suggestions!</p>
          <a href="/closet" className="btn-primary" style={{ display: "inline-flex", width: "auto" }}>
            Take me to My Closet
          </a>
        </div>
      ) : (
        <div style={{ maxWidth: "540px" }}>
          <GetDressedForm
            onResult={setResult}
            onLoading={setLoading}
          />
        </div>
      )}
    </div>
  );
}
