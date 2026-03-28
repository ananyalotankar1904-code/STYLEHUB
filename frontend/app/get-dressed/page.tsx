"use client";

import { useState, useEffect } from "react";
import GetDressedForm from "@/components/GetDressedForm";
import LoadingState from "@/components/LoadingState";
import OutfitSuggestion from "@/components/OutfitSuggestion";
import { OutfitSuggestion as OutfitSuggestionType, ClothingItem } from "@/lib/types";
import { fetchWardrobe } from "@/lib/api";
import { Wand2, Shirt, Clock, Trash2 } from "lucide-react";
import { useOutfitHistory } from "@/hooks/useOutfitHistory";

export default function GetDressedPage() {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [wardrobeLoading, setWardrobeLoading] = useState(true);
  const [result, setResult] = useState<OutfitSuggestionType | null>(null);
  const { history, saveOutfit, clearHistory } = useOutfitHistory();

  const handleResult = (data: OutfitSuggestionType) => {
    setResult(data);
  };

  const handleManualSave = () => {
    if (!result) return;
    saveOutfit({
      occasion: result.occasion,
      trend: result.trend,
      top: result.outfit.top,
      bottom: result.outfit.bottom,
      shoes: result.outfit.shoes,
      outerwear: result.outfit.outerwear,
      accessory: result.outfit.accessory,
    });
  };

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
        <OutfitSuggestion suggestion={result} onReset={handleReset} onSave={handleManualSave} />
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
        <div style={{ maxWidth: "540px", width: "100%" }}>
          <GetDressedForm
            onResult={handleResult}
            onLoading={setLoading}
          />

          {history.length > 0 && (
            <div style={{ marginTop: "4rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Clock size={20} color="var(--text-secondary)" />
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Previously Styled</h2>
                  <span style={{ background: "#fce7f3", color: "#db2777", border: "1px solid #fbcfe8", padding: "2px 8px", borderRadius: "100px", fontSize: "0.75rem", fontWeight: 600 }}>
                    {history.length}
                  </span>
                </div>
                <button onClick={clearHistory} className="btn-outline" style={{ padding: "6px 12px", fontSize: "0.8rem", height: "auto", border: "none", opacity: 0.8 }}>
                  <Trash2 size={16} style={{ marginRight: "4px" }} />
                  Clear
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {history.map((record) => (
                  <div key={record.id} style={{ background: "var(--surface)", padding: "1.5rem", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                      <div style={{ fontWeight: 600, textTransform: "capitalize" }}>{record.occasion} &bull; {record.trend}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{new Date(record.date).toLocaleDateString()}</div>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      {[record.top, record.bottom, record.shoes, record.outerwear, record.accessory].filter(Boolean).map((item, idx) => {
                        if (!item) return null;
                        return (
                          <div key={idx} style={{ flex: 1, background: "var(--bg)", borderRadius: "8px", padding: "0.5rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                            <div style={{ width: "40px", height: "40px", borderRadius: "100px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface-2)", fontSize: "1.5rem" }}>
                              {item.imageSource ? (
                                <img src={item.imageSource} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              ) : (
                                "✨"
                              )}
                            </div>
                            <span style={{ fontSize: "0.7rem", textAlign: "center", color: "var(--text-secondary)", lineHeight: 1.2 }}>{item.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
