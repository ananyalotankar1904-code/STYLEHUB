"use client";

import { OutfitSuggestion as OutfitSuggestionType } from "@/lib/types";
import { Sparkles, RotateCcw, Share2, BookmarkPlus, Check } from "lucide-react";
import { useState } from "react";

interface Props {
  suggestion: OutfitSuggestionType;
  onReset: () => void;
  onSave?: () => void;
}

const SLOT_META: Record<string, { label: string; emoji: string }> = {
  top: { label: "Top", emoji: "👔" },
  bottom: { label: "Bottom", emoji: "👖" },
  shoes: { label: "Shoes", emoji: "👟" },
  outerwear: { label: "Outerwear", emoji: "🧥" },
  accessory: { label: "Accessory", emoji: "💍" },
};

function getGeneralSuggestion(slot: string, occasion: string, trend: string) {
  const o = occasion.toLowerCase();
  const t = trend.toLowerCase();
  if (slot === "outerwear") {
    if (o.includes("formal")) return "Consider a tailored blazer or structured coat";
    if (o.includes("casual")) return "A denim jacket or hoodie would complete this look";
    if (o.includes("party")) return "A sleek leather jacket or blazer adds an edge";
    return "A light jacket or coat layers well";
  }
  if (slot === "accessory") {
    if (t.includes("minimal")) return "A thin gold chain or simple watch ties it together";
    if (t.includes("streetwear")) return "A cap or crossbody bag elevates streetwear looks";
    if (o.includes("formal")) return "A structured handbag or leather belt completes formal looks";
    if (o.includes("party")) return "Bold earrings or a statement clutch will make the outfit pop";
    return "Add an accessory to tie the look together";
  }
  return "";
}

export default function OutfitSuggestion({ suggestion, onReset, onSave }: Props) {
  const [saved, setSaved] = useState(false);
  const ALL_SLOTS = ["top", "bottom", "shoes", "outerwear", "accessory"] as const;

  return (
    <div className="suggestion-container">
      {/* Header */}
      <div className="suggestion-header">
        <div className="suggestion-badge">
          <Sparkles size={14} />
          AI Curated Look
        </div>
        <h2 className="suggestion-title">Your Outfit</h2>
        <p className="suggestion-subtitle">
          <span className="pill">{suggestion.occasion}</span>
          <span className="pill">{suggestion.trend}</span>
        </p>

        {suggestion.compatibility_score !== undefined && (
          <div style={{ marginTop: "1rem", maxWidth: "200px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: "4px", fontWeight: 600 }}>
              <span style={{ color: "var(--text-secondary)" }}>Style Harmony</span>
              <span style={{ color: "var(--accent)" }}>{suggestion.compatibility_score}%</span>
            </div>
            <div style={{ height: "4px", width: "100%", background: "var(--surface-2)", borderRadius: "100px", overflow: "hidden" }}>
              <div 
                style={{ 
                  height: "100%", 
                  width: `${suggestion.compatibility_score}%`, 
                  background: suggestion.compatibility_score > 75 ? "linear-gradient(90deg, #A88B6E, var(--accent))" : "var(--accent)",
                  borderRadius: "100px",
                  transition: "width 1s ease-out" 
                }} 
              />
            </div>
          </div>
        )}
      </div>

      {/* Outfit Grid */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem", marginBottom: "2rem" }}>
        {ALL_SLOTS.map((key) => {
          const item = suggestion.outfit[key];
          const meta = SLOT_META[key];
          
          if (!item && (key === "top" || key === "bottom" || key === "shoes")) return null;

          if (!item) {
            // Missing outerwear or accessory -> General Suggestion Card
            return (
              <div 
                key={key} 
                className="outfit-slot" 
                style={{ border: "2px solid #FFD6E0", position: "relative", minWidth: "120px", maxWidth: "160px", flex: "1 1 120px" }}
              >
                <div style={{ position: "absolute", top: "-8px", right: "-8px", background: "#FFD6E0", color: "#FF6B6B", padding: "2px 8px", borderRadius: "100px", fontSize: "0.6rem", fontWeight: "bold" }}>
                  Suggested
                </div>
                <div className="outfit-slot-emoji" style={{ background: "#FFF0F3", border: "none" }}>
                  {key === "outerwear" ? "🧥" : "💍"}
                </div>
                <div className="outfit-slot-body">
                  <p className="outfit-slot-label" style={{ color: "#FF6B6B" }}>{meta.label}</p>
                  <p className="outfit-slot-name" style={{ color: "#888", fontSize: "0.75rem", whiteSpace: "normal", lineHeight: 1.3 }}>
                    {getGeneralSuggestion(key, suggestion.occasion, suggestion.trend)}
                  </p>
                </div>
              </div>
            );
          }

          return (
            <div key={key} className="outfit-slot" style={{ minWidth: "120px", maxWidth: "160px", flex: "1 1 120px" }}>
              <div className="outfit-slot-emoji">
                {item.imageSource ? (
                  <img
                    src={item.imageSource}
                    alt={item.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "var(--radius-sm)" }}
                  />
                ) : (
                  meta.emoji
                )}
              </div>
              <div className="outfit-slot-body">
                <p className="outfit-slot-label">{meta.label}</p>
                <p className="outfit-slot-name">{item.name}</p>
                <p className="outfit-slot-meta">{item.color} · {item.fabric ?? ""}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Style Note */}
      <div className="style-note">
        <p className="style-note-label">✦ Style Note</p>
        <p className="style-note-text">{suggestion.style_note}</p>
      </div>

      {/* Trend Profile */}
      {suggestion.trend_profile?.preferred_colors?.length > 0 && (
        <div className="trend-profile">
          <p className="trend-profile-label">Palette this season</p>
          <div className="color-dots">
            {suggestion.trend_profile.preferred_colors.slice(0, 5).map((c) => (
              <span key={c} className="color-dot-label">{c}</span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="suggestion-actions">
        {onSave && (
          <button 
            className="btn-primary" 
            disabled={saved}
            onClick={() => { onSave(); setSaved(true); }}
            style={{ width: "100%", opacity: saved ? 0.7 : 1, marginBottom: "0.5rem" }}
          >
            {saved ? <Check size={16} /> : <BookmarkPlus size={16} />}
            {saved ? "Saved to History" : "Save Outfit"}
          </button>
        )}
        <div style={{ display: "flex", gap: "1rem" }}>
          <button onClick={onReset} className="btn-outline">
            <RotateCcw size={16} />
            Try Again
          </button>
          <button className="btn-outline" onClick={() => navigator.share?.({ title: "My StyleHub Look", text: suggestion.style_note })}>
            <Share2 size={16} />
            Share Look
          </button>
        </div>
      </div>
    </div>
  );
}
