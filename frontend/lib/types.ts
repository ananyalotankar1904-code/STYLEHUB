export interface ClothingItem {
  id: string;
  name: string;
  category: "Tops" | "Bottoms" | "Outerwear" | "Footwear" | "Accessories";
  color: string;
  fabric: string;
  occasion_tags: string[];
  trend_tags: string[];
  image_url?: string;
  imageSource?: string; // New: for local upload previews
  emoji: string;
}

export interface OutfitItem {
  name: string;
  category: string;
  color: string;
  fabric?: string;
  imageSource?: string;
}

export interface OutfitSuggestion {
  occasion: string;
  trend: string;
  outfit: {
    top: OutfitItem | null;
    bottom: OutfitItem | null;
    shoes: OutfitItem | null;
    outerwear?: OutfitItem | null;
    accessory?: OutfitItem | null;
  };
  style_note: string;
  missing_categories: string[];
  trend_profile: {
    description: string;
    preferred_colors: string[];
    preferred_fabrics: string[];
    avoid: string[];
  };
  compatibility_score?: number;
  source: "wardrobe" | "mock";
}

export type Theme = "light" | "dark";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}
