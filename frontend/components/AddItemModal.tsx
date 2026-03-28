"use client";

import { useState } from "react";
import { X, Plus, Loader2 } from "lucide-react";
import { ClothingItem } from "@/lib/types";
import { CATEGORIES } from "@/lib/mockData";
import { addWardrobeItem } from "@/lib/api";
import { compressImage } from "@/lib/utils";

interface Props {
  onAdd: (item: ClothingItem) => void;
  onClose: () => void;
}

const OCCASION_OPTIONS = ["casual", "formal", "work", "date", "party", "gym"];
const TREND_OPTIONS = ["minimal", "streetwear", "formal"];

export default function AddItemModal({ onAdd, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [imageSource, setImageSource] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    category: "Tops" as ClothingItem["category"],
    color: "",
    fabric: "",
    occasion_tags: [] as string[],
    trend_tags: [] as string[],
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        try {
          // Compress the base64 before saving to state
          const compressed = await compressImage(base64);
          setImageSource(compressed);
        } catch (err) {
          console.error("Compression error:", err);
          setImageSource(base64); // Fallback to original if compression fails
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const toggle = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.color || !form.fabric) return;

    setLoading(true);
    try {
      const emojiMap: Record<string, string> = {
        Tops: "👔", Bottoms: "👖", Outerwear: "🧥", Footwear: "👟", Accessories: "👜",
      };

      const newItem = await addWardrobeItem({
        ...form,
        emoji: emojiMap[form.category],
        imageSource: imageSource || undefined,
      });

      onAdd(newItem);
      onClose();
    } catch (err) {
      alert("Failed to add item to wardrobe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Add to Closet</h2>
          <button onClick={onClose} className="modal-close"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Item Photo</label>
            <div
              style={{
                width: "100%",
                height: "160px",
                border: "2px dashed var(--border)",
                borderRadius: "var(--radius)",
                background: "var(--surface-2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
              }}
              onClick={() => document.getElementById("photo-input")?.click()}
            >
              {imageSource ? (
                <img
                  src={imageSource}
                  alt="Preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div style={{ textAlign: "center", color: "var(--text-muted)" }}>
                  <Plus size={24} style={{ marginBottom: "8px" }} />
                  <p style={{ fontSize: "0.8rem" }}>Upload Photo</p>
                </div>
              )}
              <input
                id="photo-input"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Item Name *</label>
            <input
              className="form-input"
              placeholder="e.g. White Oxford Shirt"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                className="form-input"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as ClothingItem["category"] })}
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Color *</label>
              <input
                className="form-input"
                placeholder="e.g. Beige"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Fabric *</label>
            <input
              className="form-input"
              placeholder="e.g. Linen, Cotton, Wool"
              value={form.fabric}
              onChange={(e) => setForm({ ...form, fabric: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Occasions</label>
            <div className="chip-group">
              {OCCASION_OPTIONS.map((o) => (
                <button
                  type="button"
                  key={o}
                  className={`chip ${form.occasion_tags.includes(o) ? "chip-active" : ""}`}
                  onClick={() => setForm({ ...form, occasion_tags: toggle(form.occasion_tags, o) })}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Style / Trend</label>
            <div className="chip-group">
              {TREND_OPTIONS.map((t) => (
                <button
                  type="button"
                  key={t}
                  className={`chip ${form.trend_tags.includes(t) ? "chip-active" : ""}`}
                  onClick={() => setForm({ ...form, trend_tags: toggle(form.trend_tags, t) })}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
            {loading ? "Adding..." : "Add to Closet"}
          </button>
        </form>
      </div>
    </div>
  );
}
