"use client";

import { useEffect, useState } from "react";
import { CATEGORIES } from "@/lib/mockData";
import { ClothingItem } from "@/lib/types";
import { fetchWardrobe, deleteWardrobeItem, addWardrobeItem } from "@/lib/api";
import ClothingCard from "@/components/ClothingCard";
import AddItemModal from "@/components/AddItemModal";
import { Plus, Shirt, Loader2 } from "lucide-react";
import { compressImage } from "@/lib/utils";

export default function ClosetPage() {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchWardrobe();
        setItems(data);
      } catch (err) {
        console.error("Failed to load wardrobe", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteWardrobeItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      alert("Failed to delete item");
    }
  };

  const handleAdd = (item: ClothingItem) => {
    setItems((prev) => [item, ...prev]);
  };

  const allCategories = ["All", ...CATEGORIES];

  const filtered =
    activeCategory === "All"
      ? items
      : items.filter((i) => i.category === activeCategory);

  const countFor = (cat: string) =>
    cat === "All" ? items.length : items.filter((i) => i.category === cat).length;

  return (
    <div className="page">
      {/* Header */}
      <div className="page-hero">
        <p className="page-eyebrow">✦ Your Wardrobe</p>
        <h1 className="page-title">My Closet</h1>
        <p className="page-subtitle" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <span>{items.length} pieces catalogued &mdash; your personal style archive.</span>
          <button
            className="btn-primary"
            style={{ width: "auto", padding: "10px 20px", borderRadius: "100px" }}
            onClick={() => setShowModal(true)}
          >
            <Plus size={18} />
            Add Item
          </button>
        </p>
      </div>

      {/* Categories Grid */}
      <div className="category-cards-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem", marginBottom: "3rem" }}>
        {CATEGORIES.map((cat) => (
          <div
            key={cat}
            className={`category-card-item ${activeCategory === cat ? "active" : ""}`}
            style={{
              background: activeCategory === cat ? "var(--accent)" : "var(--surface)",
              color: activeCategory === cat ? "var(--accent-text)" : "var(--text-primary)",
              padding: "1.5rem",
              borderRadius: "var(--radius)",
              border: "1px solid var(--border)",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onClick={() => setActiveCategory(cat)}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
              {cat === "Tops" ? "👕" : cat === "Bottoms" ? "👖" : cat === "Outerwear" ? "🧥" : cat === "Footwear" ? "👟" : "👜"}
            </div>
            <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>{cat}</h3>
            <p style={{ fontSize: "0.8rem", opacity: 0.8 }}>{countFor(cat)} items</p>

            <label
              style={{
                display: "inline-flex",
                marginTop: "1rem",
                fontSize: "0.75rem",
                padding: "6px 12px",
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "100px",
                cursor: "pointer",
                fontWeight: 600,
                color: activeCategory === cat ? "var(--accent-text)" : "var(--text-secondary)"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Plus size={12} style={{ marginRight: "4px" }} />
              Quick Add
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onloadend = async () => {
                    const rawBase64 = reader.result as string;
                    try {
                      // Compress before sending
                      const base64 = await compressImage(rawBase64);
                      const emojiMap: Record<string, string> = {
                        Tops: "👕", Bottoms: "👖", Outerwear: "🧥", Footwear: "👟", Accessories: "👜",
                      };
                      const newItem = await addWardrobeItem({
                        name: `New ${cat} ${countFor(cat) + 1}`,
                        category: cat as any,
                        color: "Unknown",
                        fabric: "Unknown",
                        occasion_tags: [],
                        trend_tags: [],
                        emoji: emojiMap[cat] || "✨",
                        imageSource: base64
                      });
                      handleAdd(newItem);
                    } catch (err) { 
                      console.error("Quick add error:", err);
                      alert("Error adding item"); 
                    }
                  };
                  reader.readAsDataURL(file);
                }}
              />
            </label>
          </div>
        ))}
      </div>

      {/* Actual List of filtered items */}
      <div style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600 }}>
          {activeCategory} Items
        </h2>
        {activeCategory !== "All" && countFor(activeCategory) > 0 && (
          <button
            className="btn-outline"
            style={{ padding: "6px 12px", fontSize: "0.8rem" }}
            onClick={() => setActiveCategory("All")}
          >
            Show All
          </button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
          <Loader2 className="animate-spin" size={32} color="var(--accent)" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="closet-grid">
          {filtered.map((item) => (
            <ClothingCard key={item.id} item={item} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <div className="closet-empty">
          <div className="closet-empty-icon">
            <Shirt size={44} />
          </div>
          <p style={{ fontWeight: 600, color: "var(--text-primary)" }}>
            Nothing here yet
          </p>
          <p style={{ fontSize: "0.875rem" }}>
            Use Quick Add above or the Plus button to add pieces.
          </p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <AddItemModal onAdd={handleAdd} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
