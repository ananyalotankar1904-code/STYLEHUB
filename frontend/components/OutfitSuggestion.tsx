"use client";

import { OutfitSuggestion as OutfitSuggestionType } from "@/lib/types";
import { Sparkles, RotateCcw, Share2 } from "lucide-react";

interface Props {
  suggestion: OutfitSuggestionType;
  onReset: () => void;
}

const SLOT_META: Record<string, { label: string; emoji: string }> = {
  top: { label: "Top", emoji: "👔" },
  bottom: { label: "Bottom", emoji: "👖" },
  shoes: { label: "Shoes", emoji: "👟" },
  outerwear: { label: "Outerwear", emoji: "🧥" },
};

export default function OutfitSuggestion({ suggestion, onReset }: Props) {
  const slots = Object.entries(suggestion.outfit).filter(([, val]) => val !== null && val !== undefined);

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
      </div>

      {/* Outfit Grid */}
      <div className="outfit-grid">
        {slots.map(([key, item]) => {
          if (!item) return null;
          const meta = SLOT_META[key] ?? { label: key, emoji: "✨" };
          return (
            <div key={key} className="outfit-slot">
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
        <button onClick={onReset} className="btn-outline">
          <RotateCcw size={16} />
          Try Again
        </button>
        <button className="btn-primary" onClick={() => navigator.share?.({ title: "My StyleHub Look", text: suggestion.style_note })}>
          <Share2 size={16} />
          Share Look
        </button>
      </div>
    </div>
  );
}
