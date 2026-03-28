"""
StyleHub — Outfit Recommendation Engine  (refactored)

Scoring model (per clothing slot):
  +3  occasion tag exact match
  +2  trend tag exact match
  +1  colour is compatible with already-selected pieces  (COLOR_PAIRS)
  +1  colour/fabric listed in trend profile preferred lists
  -1  per formality-level gap > 1 across pieces  (FABRIC_FORMALITY)
  -2  same non-neutral colour as another selected piece (clash penalty)

Engine picks highest-scoring candidate per slot in order: top → bottom → shoes → accessory.
This replaces "first match wins" with ranked selection that considers colour
harmony and fabric coherence across the full outfit.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Optional

TREND_PROFILES_PATH = Path(__file__).parent.parent / "data" / "trend_profiles.json"

# ---------------------------------------------------------------------------
# Colour compatibility map
# ---------------------------------------------------------------------------
COLOR_PAIRS: dict[str, set[str]] = {
    "white":      {"black", "navy", "grey", "beige", "burgundy", "olive", "brown"},
    "black":      {"white", "grey", "red", "navy", "beige", "camel", "pink"},
    "grey":       {"white", "black", "navy", "burgundy", "camel", "pink"},
    "beige":      {"white", "black", "brown", "olive", "camel", "navy"},
    "navy":       {"white", "grey", "beige", "camel", "burgundy", "light blue"},
    "camel":      {"white", "black", "navy", "grey", "brown"},
    "brown":      {"beige", "camel", "white", "olive", "cream"},
    "olive":      {"white", "black", "beige", "camel", "brown"},
    "burgundy":   {"white", "grey", "navy", "camel", "black"},
    "red":        {"black", "white", "navy", "grey"},
    "pink":       {"grey", "white", "black", "navy"},
    "camo":       {"black", "white", "olive", "brown"},
    "charcoal":   {"white", "black", "light blue", "burgundy"},
    "cream":      {"brown", "camel", "olive", "navy"},
}

# ---------------------------------------------------------------------------
# Fabric formality weights — 1 (very casual) → 5 (very formal)
# ---------------------------------------------------------------------------
FABRIC_FORMALITY: dict[str, int] = {
    "jersey":          1,
    "fleece":          1,
    "denim":           2,
    "nylon":           2,
    "canvas":          2,
    "cotton":          3,
    "linen":           3,
    "cotton blend":    3,
    "polyester blend": 3,
    "corduroy":        3,
    "wool blend":      4,
    "silk":            4,
    "wool":            5,
    "leather":         4,
    "cashmere":        5,
    "velvet":          5,
    "tweed":           5,
}

# ---------------------------------------------------------------------------
# Mock outfits — returned only when the wardrobe is completely empty
# ---------------------------------------------------------------------------
MOCK_OUTFIT = {
    "casual": {
        "minimal": {
            "top":    {"name": "White Linen Shirt",       "category": "Tops",     "color": "white",    "fabric": "linen"},
            "bottom": {"name": "Beige Straight Trousers", "category": "Bottoms",  "color": "beige",    "fabric": "cotton"},
            "shoes":  {"name": "White Leather Sneakers",  "category": "Footwear", "color": "white",    "fabric": "leather"},
            "style_note": "Clean, effortless, and seasonless. The linen shirt breathes well and keeps the palette calm — perfect casual minimal.",
        },
        "streetwear": {
            "top":    {"name": "Oversized Graphic Tee",  "category": "Tops",     "color": "black", "fabric": "jersey"},
            "bottom": {"name": "Cargo Joggers",          "category": "Bottoms",  "color": "olive", "fabric": "nylon"},
            "shoes":  {"name": "High-Top Sneakers",      "category": "Footwear", "color": "white", "fabric": "canvas"},
            "style_note": "Urban utility — the cargo joggers add function while the crisp white sneakers anchor the look.",
        },
    },
    "formal": {
        "minimal": {
            "top":    {"name": "Slim-Fit White Oxford",  "category": "Tops",     "color": "white",    "fabric": "cotton blend"},
            "bottom": {"name": "Charcoal Wool Trousers", "category": "Bottoms",  "color": "charcoal", "fabric": "wool"},
            "shoes":  {"name": "Oxford Leather Shoes",   "category": "Footwear", "color": "black",    "fabric": "leather"},
            "style_note": "Timeless, sharp, and investor-ready. The charcoal-white contrast is classic boardroom confidence.",
        },
        "formal": {
            "top":    {"name": "Navy Blazer",        "category": "Tops",     "color": "navy",     "fabric": "wool"},
            "bottom": {"name": "Grey Slim Trousers", "category": "Bottoms",  "color": "grey",     "fabric": "wool blend"},
            "shoes":  {"name": "Brogue Derby Shoes", "category": "Footwear", "color": "burgundy", "fabric": "leather"},
            "style_note": "The burgundy brogues elevate this beyond the ordinary — a considered detail that reads sophisticated.",
        },
    },
}

SLOT_ORDER         = ["top", "bottom", "shoes", "outerwear", "accessory"]
SLOT_TO_CATEGORY   = {"top": "Tops", "bottom": "Bottoms", "shoes": "Footwear", "outerwear": "Outerwear", "accessory": "Accessories"}


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def generate_outfit(
    items: list[dict],
    occasion: str,
    trend: str,
    include_accessories: bool = False,
    exclude_item_ids: list[str] | None = None,
) -> dict:
    print(f"[LOGIC] generate_outfit — occasion={occasion}, trend={trend}, items={len(items)}")

    trend_profiles = _load_trend_profiles()
    exclude_ids    = set(exclude_item_ids or [])
    candidates     = [i for i in items if str(i.get("_id", i.get("id", ""))) not in exclude_ids]

    if not candidates:
        return _mock_response(occasion, trend, trend_profiles)

    slots    = SLOT_ORDER
    selected: dict[str, Optional[dict]] = {}
    missing: list[str] = []

    for slot in slots:
        best = _pick_best(slot, candidates, selected, occasion, trend, trend_profiles)
        if best:
            selected[slot] = best
        else:
            selected[slot] = None
            missing.append(slot)

    core_filled = any(selected.get(s) for s in ["top", "bottom", "shoes"])
    if not core_filled:
        return _mock_response(occasion, trend, trend_profiles)

    score      = _outfit_compatibility_score(selected)
    style_note = _build_style_note(selected, occasion, trend, trend_profiles, score)

    return {
        "occasion":            occasion,
        "trend":               trend,
        "outfit":              selected,
        "style_note":          style_note,
        "missing_categories":  missing,
        "trend_profile":       trend_profiles.get(trend, {}),
        "compatibility_score": score,
        "source":              "wardrobe",
    }


# ---------------------------------------------------------------------------
# Scoring engine
# ---------------------------------------------------------------------------

def _score_item(
    item: dict,
    slot: str,
    occasion: str,
    trend: str,
    already_selected: dict[str, Optional[dict]],
    trend_profiles: dict,
) -> int:
    score = 0
    item_occasion_tags = [t.lower() for t in item.get("occasion_tags", [])]
    item_trend_tags    = [t.lower() for t in item.get("trend_tags", [])]
    item_color         = item.get("color", "").lower()
    item_fabric        = item.get("fabric", "").lower()

    if occasion.lower() in item_occasion_tags:
        score += 3
    if trend.lower() in item_trend_tags:
        score += 2

    profile = trend_profiles.get(trend, {})
    if item_color in [c.lower() for c in profile.get("preferred_colors", [])]:
        score += 1
    if item_fabric in [f.lower() for f in profile.get("preferred_fabrics", [])]:
        score += 1

    selected_colors = [
        p["color"].lower() for p in already_selected.values() if p and p.get("color")
    ]
    for sel_color in selected_colors:
        if item_color in COLOR_PAIRS.get(sel_color, set()) or sel_color in COLOR_PAIRS.get(item_color, set()):
            score += 1
        elif item_color == sel_color and item_color not in {"white", "black", "grey"}:
            score -= 2

    item_formality = FABRIC_FORMALITY.get(item_fabric, 3)
    for p in already_selected.values():
        if p:
            sel_form = FABRIC_FORMALITY.get(p.get("fabric", "").lower(), 3)
            gap = abs(item_formality - sel_form)
            if gap > 1:
                score -= (gap - 1)

    return score


def _pick_best(
    slot: str,
    candidates: list[dict],
    already_selected: dict[str, Optional[dict]],
    occasion: str,
    trend: str,
    trend_profiles: dict,
) -> Optional[dict]:
    category = SLOT_TO_CATEGORY.get(slot)
    pool     = [i for i in candidates if i.get("category") == category]
    if not pool:
        return None

    scored = sorted(
        [(item, _score_item(item, slot, occasion, trend, already_selected, trend_profiles)) for item in pool],
        key=lambda x: x[1],
        reverse=True,
    )
    best_item, best_score = scored[0]
    print(f"  [SCORE] {slot}: '{best_item.get('name')}' score={best_score}")
    return best_item


# ---------------------------------------------------------------------------
# Compatibility score  0–100
# ---------------------------------------------------------------------------

def _outfit_compatibility_score(selected: dict[str, Optional[dict]]) -> int:
    pieces = [p for p in selected.values() if p]
    if not pieces:
        return 0

    total_checks  = 0
    passed_checks = 0.0

    colors      = [p.get("color", "").lower() for p in pieces]
    fabrics     = [p.get("fabric", "").lower() for p in pieces]
    formalities = [FABRIC_FORMALITY.get(f, 3) for f in fabrics]

    for i in range(len(colors)):
        for j in range(i + 1, len(colors)):
            total_checks += 1
            c1, c2 = colors[i], colors[j]
            if c1 in COLOR_PAIRS.get(c2, set()) or c2 in COLOR_PAIRS.get(c1, set()):
                passed_checks += 1
            elif c1 == c2 and c1 in {"white", "black", "grey"}:
                passed_checks += 1

    if formalities:
        spread = max(formalities) - min(formalities)
        total_checks += 1
        if spread <= 1:
            passed_checks += 1
        elif spread == 2:
            passed_checks += 0.5

    core_filled   = sum(1 for s in ["top", "bottom", "shoes"] if selected.get(s))
    coverage_score = (core_filled / 3) * 20

    if total_checks == 0:
        return int(50 + coverage_score)

    harmony_score = (passed_checks / total_checks) * 80
    return min(100, int(harmony_score + coverage_score))


# ---------------------------------------------------------------------------
# Style note
# ---------------------------------------------------------------------------

def _build_style_note(
    selected: dict[str, Optional[dict]],
    occasion: str,
    trend: str,
    profiles: dict,
    score: int,
) -> str:
    profile     = profiles.get(trend, {})
    description = profile.get("description", f"{trend} aesthetic")

    top    = selected.get("top")
    bottom = selected.get("bottom")
    shoes  = selected.get("shoes")
    outer  = selected.get("outerwear")
    acc    = selected.get("accessory")

    if not top or not bottom or not shoes:
        return f"A curated {trend} look for {occasion}."

    pair = f"{top['name']} with {bottom['name']}"
    tail = f", finished with {shoes['name']}"

    o = occasion.lower()
    t = trend.lower()
    
    outer_line = ""
    if outer:
        ocol = outer.get("color", "")
        outer_line = f" Layer with your {ocol} outerwear." if ocol else " Layer with your outerwear."
    else:
        if "formal" in o: outer_line = " Consider a tailored blazer or structured coat."
        elif "casual" in o: outer_line = " A denim jacket or hoodie would complete this look."
        elif "party" in o: outer_line = " A sleek leather jacket or blazer adds an edge."
        else: outer_line = " A light jacket or coat layers well."

    acc_line = ""
    if acc:
        acol = acc.get("color", "")
        acc_line = f" Finish with your {acol} accessory." if acol else " Finish with your accessory."
    else:
        if "minimal" in t: acc_line = " A thin gold chain or simple watch ties it together."
        elif "streetwear" in t: acc_line = " A cap or crossbody bag elevates streetwear looks."
        elif "formal" in o: acc_line = " A structured handbag or leather belt completes formal looks."
        elif "party" in o: acc_line = " Bold earrings or a statement clutch will make the outfit pop."
        else: acc_line = " Add an accessory to tie the look together."

    # Max 4 sentences: description(1) + pair(2) + outer(3) + acc(4)
    return f"{description}. Pair your {pair}{tail}.{outer_line}{acc_line}".strip()


# ---------------------------------------------------------------------------
# Mock fallback
# ---------------------------------------------------------------------------

def _mock_response(occasion: str, trend: str, trend_profiles: dict) -> dict:
    print("[INFO] Wardrobe empty — returning mock outfit")
    occ_key   = "formal" if any(w in occasion for w in ("formal", "work")) else "casual"
    trend_key = trend if trend in MOCK_OUTFIT.get(occ_key, {}) else "minimal"
    mock      = dict(MOCK_OUTFIT.get(occ_key, {}).get(trend_key, MOCK_OUTFIT["casual"]["minimal"]))
    note      = mock.pop("style_note", f"A curated {trend} look for {occasion}.")
    return {
        "occasion":            occasion,
        "trend":               trend,
        "outfit":              mock,
        "style_note":          note,
        "missing_categories":  [],
        "trend_profile":       trend_profiles.get(trend, {}),
        "compatibility_score": 70,
        "source":              "mock",
    }


def _load_trend_profiles() -> dict:
    try:
        with open(TREND_PROFILES_PATH, "r") as f:
            return json.load(f)
    except Exception:
        return {}
