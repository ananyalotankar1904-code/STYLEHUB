import json
import os
from pathlib import Path

TREND_PROFILES_PATH = Path(__file__).parent.parent / "data" / "trend_profiles.json"

# Hardcoded mock outfit for pitch demo when wardrobe is empty
MOCK_OUTFIT = {
    "casual": {
        "minimal": {
            "top": {"name": "White Linen Shirt", "category": "Tops", "color": "white", "fabric": "linen"},
            "bottom": {"name": "Beige Straight Trousers", "category": "Bottoms", "color": "beige", "fabric": "cotton"},
            "shoes": {"name": "White Leather Sneakers", "category": "Footwear", "color": "white", "fabric": "leather"},
            "style_note": "Clean, effortless, and seasonless. The linen shirt breathes well and keeps the palette calm — perfect casual minimal.",
        },
        "streetwear": {
            "top": {"name": "Oversized Graphic Tee", "category": "Tops", "color": "black", "fabric": "jersey"},
            "bottom": {"name": "Cargo Joggers", "category": "Bottoms", "color": "olive", "fabric": "nylon"},
            "shoes": {"name": "High-Top Sneakers", "category": "Footwear", "color": "white", "fabric": "canvas"},
            "style_note": "Urban utility — the cargo joggers add function while the crisp white sneakers anchor the look.",
        },
    },
    "formal": {
        "minimal": {
            "top": {"name": "Slim-Fit White Oxford", "category": "Tops", "color": "white", "fabric": "cotton blend"},
            "bottom": {"name": "Charcoal Wool Trousers", "category": "Bottoms", "color": "charcoal", "fabric": "wool"},
            "shoes": {"name": "Oxford Leather Shoes", "category": "Footwear", "color": "black", "fabric": "leather"},
            "style_note": "Timeless, sharp and investor-ready. The charcoal-white contrast is classic boardroom confidence.",
        },
        "formal": {
            "top": {"name": "Navy Blazer", "category": "Tops", "color": "navy", "fabric": "wool"},
            "bottom": {"name": "Grey Slim Trousers", "category": "Bottoms", "color": "grey", "fabric": "wool blend"},
            "shoes": {"name": "Brogue Derby Shoes", "category": "Footwear", "color": "burgundy", "fabric": "leather"},
            "style_note": "The burgundy brogues elevate this beyond the ordinary — a considered detail that reads sophisticated.",
        },
    },
}


def load_trend_profiles() -> dict:
    try:
        with open(TREND_PROFILES_PATH, "r") as f:
            return json.load(f)
    except Exception:
        return {}


def generate_outfit(items: list, occasion: str, trend: str) -> dict:
    print(f"[LOGIC] outfit_logic.generate_outfit called — occasion={occasion}, trend={trend}, items={len(items)}")
    trend_profiles = load_trend_profiles()

    selected = {"top": None, "bottom": None, "shoes": None}
    missing_categories = []

    categories_map = {"top": "Tops", "bottom": "Bottoms", "shoes": "Footwear"}

    for slot, cat in categories_map.items():
        # Try: occasion + trend match
        match = next(
            (
                item for item in items
                if item.get("category") == cat
                and occasion.lower() in [t.lower() for t in item.get("occasion_tags", [])]
                and trend.lower() in [t.lower() for t in item.get("trend_tags", [])]
            ),
            None,
        )

        # Fallback: occasion-only match
        if match is None:
            match = next(
                (
                    item for item in items
                    if item.get("category") == cat
                    and occasion.lower() in [t.lower() for t in item.get("occasion_tags", [])]
                ),
                None,
            )

        # Last resort: any item in category
        if match is None:
            match = next(
                (item for item in items if item.get("category") == cat),
                None,
            )

        if match:
            selected[slot] = match
        else:
            missing_categories.append(slot)

    # If wardrobe is empty, return curated mock
    if all(v is None for v in selected.values()):
        print("[INFO] Wardrobe empty — returning mock outfit for demo")
        occ_key = "formal" if "formal" in occasion.lower() or "work" in occasion.lower() else "casual"
        trend_key = trend.lower() if trend.lower() in MOCK_OUTFIT.get(occ_key, {}) else "minimal"
        mock = MOCK_OUTFIT.get(occ_key, {}).get(trend_key, MOCK_OUTFIT["casual"]["minimal"])
        style_note = mock.pop("style_note", "")
        return {
            "occasion": occasion,
            "trend": trend,
            "outfit": mock,
            "style_note": style_note,
            "missing_categories": [],
            "trend_profile": trend_profiles.get(trend, {}),
            "source": "mock",
        }

    style_note = _build_style_note(selected, occasion, trend, trend_profiles)

    return {
        "occasion": occasion,
        "trend": trend,
        "outfit": selected,
        "style_note": style_note,
        "missing_categories": missing_categories,
        "trend_profile": trend_profiles.get(trend, {}),
        "source": "wardrobe",
    }


def _build_style_note(selected: dict, occasion: str, trend: str, profiles: dict) -> str:
    profile = profiles.get(trend, {})
    description = profile.get("description", f"{trend} aesthetic")
    items_named = [v["name"] for v in selected.values() if v]
    if not items_named:
        return f"A curated {trend} look for {occasion}."
    return (
        f"{description}. "
        f"This {occasion} outfit pairs your {' and '.join(items_named[:2])} "
        f"for an effortlessly {trend} result."
    )
