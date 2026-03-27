import { ClothingItem, OutfitSuggestion } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchWardrobe(): Promise<ClothingItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/wardrobe`);
    if (!res.ok) throw new Error("Failed to fetch wardrobe");
    const data = await res.json();
    return data.items.map((item: any) => ({
      ...item,
      id: item._id || item.id,
    }));
  } catch (err) {
    console.error("API Error (fetchWardrobe):", err);
    throw err;
  }
}

export async function addWardrobeItem(item: Omit<ClothingItem, "id">): Promise<ClothingItem> {
  try {
    const res = await fetch(`${API_BASE_URL}/add-item`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error("Failed to add item");
    const data = await res.json();
    return {
      ...data.item,
      id: data.item_id || data.item._id,
    };
  } catch (err) {
    console.error("API Error (addWardrobeItem):", err);
    throw err;
  }
}

export async function deleteWardrobeItem(id: string): Promise<void> {
  try {
    const res = await fetch(`${API_BASE_URL}/wardrobe/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete item");
  } catch (err) {
    console.error("API Error (deleteWardrobeItem):", err);
    throw err;
  }
}

export async function generateOutfit(occasion: string, trend: string): Promise<OutfitSuggestion> {
  try {
    const res = await fetch(`${API_BASE_URL}/generate-outfit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ occasion, trend }),
    });
    if (!res.ok) throw new Error("Failed to generate outfit");
    return await res.json();
  } catch (err) {
    console.error("API Error (generateOutfit):", err);
    throw err;
  }
}
