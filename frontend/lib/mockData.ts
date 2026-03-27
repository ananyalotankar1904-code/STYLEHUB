import { ClothingItem } from "./types";

export const mockWardrobe: ClothingItem[] = [
  // TOPS
  {
    id: "t1",
    name: "White Linen Shirt",
    category: "Tops",
    color: "White",
    fabric: "Linen",
    occasion_tags: ["casual", "formal", "work"],
    trend_tags: ["minimal"],
    emoji: "👔",
  },
  {
    id: "t2",
    name: "Beige Ribbed Knit",
    category: "Tops",
    color: "Beige",
    fabric: "Cotton Knit",
    occasion_tags: ["casual", "date"],
    trend_tags: ["minimal", "streetwear"],
    emoji: "🧶",
  },
  {
    id: "t3",
    name: "Oversized Brown Hoodie",
    category: "Tops",
    color: "Brown",
    fabric: "Fleece",
    occasion_tags: ["casual", "gym"],
    trend_tags: ["streetwear"],
    emoji: "🧥",
  },
  {
    id: "t4",
    name: "Silk Cami Top",
    category: "Tops",
    color: "Cream",
    fabric: "Silk",
    occasion_tags: ["date", "party"],
    trend_tags: ["minimal", "formal"],
    emoji: "✨",
  },

  // BOTTOMS
  {
    id: "b1",
    name: "Beige Wide-Leg Trousers",
    category: "Bottoms",
    color: "Beige",
    fabric: "Cotton Blend",
    occasion_tags: ["casual", "work", "formal"],
    trend_tags: ["minimal"],
    emoji: "👖",
  },
  {
    id: "b2",
    name: "Dark Wash Straight Jeans",
    category: "Bottoms",
    color: "Indigo",
    fabric: "Denim",
    occasion_tags: ["casual", "date", "party"],
    trend_tags: ["streetwear", "minimal"],
    emoji: "🩳",
  },
  {
    id: "b3",
    name: "Midi Brown Skirt",
    category: "Bottoms",
    color: "Brown",
    fabric: "Satin",
    occasion_tags: ["date", "party", "formal"],
    trend_tags: ["minimal", "formal"],
    emoji: "👗",
  },
  {
    id: "b4",
    name: "Cargo Olive Trousers",
    category: "Bottoms",
    color: "Olive",
    fabric: "Nylon",
    occasion_tags: ["casual", "gym"],
    trend_tags: ["streetwear"],
    emoji: "🪖",
  },

  // OUTERWEAR
  {
    id: "o1",
    name: "Camel Wool Coat",
    category: "Outerwear",
    color: "Camel",
    fabric: "Wool",
    occasion_tags: ["formal", "work", "casual"],
    trend_tags: ["minimal", "formal"],
    emoji: "🧥",
  },
  {
    id: "o2",
    name: "Black Leather Jacket",
    category: "Outerwear",
    color: "Black",
    fabric: "Leather",
    occasion_tags: ["casual", "date", "party"],
    trend_tags: ["streetwear"],
    emoji: "🤘",
  },

  // FOOTWEAR
  {
    id: "f1",
    name: "White Leather Sneakers",
    category: "Footwear",
    color: "White",
    fabric: "Leather",
    occasion_tags: ["casual", "gym"],
    trend_tags: ["minimal", "streetwear"],
    emoji: "👟",
  },
  {
    id: "f2",
    name: "Tan Leather Loafers",
    category: "Footwear",
    color: "Tan",
    fabric: "Leather",
    occasion_tags: ["work", "formal", "date"],
    trend_tags: ["formal", "minimal"],
    emoji: "🥿",
  },
  {
    id: "f3",
    name: "Black Chelsea Boots",
    category: "Footwear",
    color: "Black",
    fabric: "Leather",
    occasion_tags: ["casual", "date", "party"],
    trend_tags: ["minimal", "streetwear", "formal"],
    emoji: "👢",
  },

  // ACCESSORIES
  {
    id: "a1",
    name: "Gold Minimalist Watch",
    category: "Accessories",
    color: "Gold",
    fabric: "Metal",
    occasion_tags: ["formal", "work", "date", "casual"],
    trend_tags: ["minimal", "formal"],
    emoji: "⌚",
  },
  {
    id: "a2",
    name: "Brown Leather Belt",
    category: "Accessories",
    color: "Brown",
    fabric: "Leather",
    occasion_tags: ["formal", "work", "casual"],
    trend_tags: ["minimal", "formal"],
    emoji: "🪢",
  },
  {
    id: "a3",
    name: "Woven Tote Bag",
    category: "Accessories",
    color: "Beige",
    fabric: "Raffia",
    occasion_tags: ["casual", "date"],
    trend_tags: ["minimal"],
    emoji: "👜",
  },
];

export const CATEGORIES = ["Tops", "Bottoms", "Outerwear", "Footwear", "Accessories"] as const;

export const OCCASIONS = ["Work", "Date Night", "Gym", "Casual", "Party", "Formal"] as const;

export const WEATHER_OPTIONS = [
  { label: "Hot (30°C+)", value: "hot" },
  { label: "Warm (22–29°C)", value: "warm" },
  { label: "Cool (15–21°C)", value: "cool" },
  { label: "Cold (Below 15°C)", value: "cold" },
] as const;

export const TRENDS = ["minimal", "streetwear", "formal"] as const;
