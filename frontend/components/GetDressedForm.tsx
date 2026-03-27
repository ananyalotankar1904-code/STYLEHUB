"use client";

import { useState } from "react";
import { OCCASIONS, WEATHER_OPTIONS, TRENDS } from "@/lib/mockData";
import { generateOutfit } from "@/lib/api";
import { OutfitSuggestion } from "@/lib/types";
import { Wand2, ChevronDown } from "lucide-react";

interface Props {
  onResult: (result: OutfitSuggestion) => void;
  onLoading: (loading: boolean) => void;
}

export default function GetDressedForm({ onResult, onLoading }: Props) {
  const [occasion, setOccasion] = useState("");
  const [weather, setWeather] = useState("");
  const [weatherText, setWeatherText] = useState("");
  const [trend, setTrend] = useState("minimal");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!occasion) return;

    onLoading(true);

    // Artificial delay for demo effect (styling magic...)
    await new Promise((r) => setTimeout(r, 2000));

    try {
      const data = await generateOutfit(occasion.toLowerCase(), trend);
      onResult(data);
    } catch (err) {
      console.error("Outfit generation failed", err);
      // Fallback mock if backend is down
      onResult({
        occasion,
        trend,
        outfit: {
          top: { name: "White Linen Shirt", category: "Tops", color: "White", fabric: "Linen" },
          bottom: { name: "Beige Wide-Leg Trousers", category: "Bottoms", color: "Beige", fabric: "Cotton" },
          shoes: { name: "Tan Leather Loafers", category: "Footwear", color: "Tan", fabric: "Leather" },
          outerwear: { name: "Camel Wool Coat", category: "Outerwear", color: "Camel", fabric: "Wool" },
        },
        style_note:
          "Warm neutrals anchored by the camel coat — the kind of effortless polish that reads intentional without trying too hard.",
        missing_categories: [],
        trend_profile: {
          description: "Clean lines, neutral tones, understated elegance",
          preferred_colors: ["white", "beige", "camel", "tan"],
          preferred_fabrics: ["linen", "cotton", "wool"],
          avoid: ["loud prints"],
        },
        source: "mock",
      });
    } finally {
      onLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="get-dressed-form">
      {/* Occasion chips */}
      <div className="form-group">
        <label className="form-label">What&apos;s the occasion?</label>
        <div className="chip-group">
          {OCCASIONS.map((o) => (
            <button
              type="button"
              key={o}
              className={`chip-lg ${occasion === o ? "chip-active" : ""}`}
              onClick={() => setOccasion(o)}
            >
              {o}
            </button>
          ))}
        </div>
        <input
          className="form-input mt-3"
          placeholder="Or type your own..."
          value={occasion}
          onChange={(e) => setOccasion(e.target.value)}
        />
      </div>

      {/* Weather */}
      <div className="form-group">
        <label className="form-label">What&apos;s the weather like?</label>
        <div className="select-wrapper">
          <select
            className="form-input"
            value={weather}
            onChange={(e) => {
              setWeather(e.target.value);
              setWeatherText(e.target.value);
            }}
          >
            <option value="">Select weather...</option>
            {WEATHER_OPTIONS.map((w) => (
              <option key={w.value} value={w.value}>
                {w.label}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="select-icon" />
        </div>
        <input
          className="form-input mt-3"
          placeholder="Or describe it... e.g. 'breezy evening'"
          value={weatherText}
          onChange={(e) => setWeatherText(e.target.value)}
        />
      </div>

      {/* Style */}
      <div className="form-group">
        <label className="form-label">Your style vibe</label>
        <div className="chip-group">
          {TRENDS.map((t) => (
            <button
              type="button"
              key={t}
              className={`chip-lg ${trend === t ? "chip-active" : ""}`}
              onClick={() => setTrend(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <button type="submit" className="btn-primary btn-xl" disabled={!occasion}>
        <Wand2 size={20} />
        Generate My Look
      </button>
    </form>
  );
}
