from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime

VALID_CATEGORIES = {"Tops", "Bottoms", "Outerwear", "Footwear", "Accessories"}

# ---------------------------------------------------------------------------
# Colour compatibility map — used by scoring engine in outfit_logic.py
# ---------------------------------------------------------------------------
COLOR_PAIRS: dict[str, set[str]] = {
    "white":     {"black", "navy", "grey", "beige", "burgundy", "olive", "brown"},
    "black":     {"white", "grey", "red", "navy", "beige", "camel", "pink"},
    "grey":      {"white", "black", "navy", "burgundy", "camel", "pink"},
    "beige":     {"white", "black", "brown", "olive", "camel", "navy"},
    "navy":      {"white", "grey", "beige", "camel", "burgundy", "light blue"},
    "camel":     {"white", "black", "navy", "grey", "brown"},
    "brown":     {"beige", "camel", "white", "olive", "cream"},
    "olive":     {"white", "black", "beige", "camel", "brown"},
    "burgundy":  {"white", "grey", "navy", "camel", "black"},
    "red":       {"black", "white", "navy", "grey"},
    "pink":      {"grey", "white", "black", "navy"},
    "camo":      {"black", "white", "olive", "brown"},
    "charcoal":  {"white", "black", "light blue", "burgundy"},
    "cream":     {"brown", "camel", "olive", "navy"},
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


class ClothingItem(BaseModel):
    id: Optional[str] = None
    name: str
    category: str           # "Tops" | "Bottoms" | "Outerwear" | "Footwear" | "Accessories"
    color: str
    fabric: str
    occasion_tags: list[str]
    trend_tags: list[str]
    emoji: str
    image_url: Optional[str] = None
    imageSource: Optional[str] = None
    user_id: str = Field(default="guest")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    @field_validator("category")
    @classmethod
    def validate_category(cls, v: str) -> str:
        if v not in VALID_CATEGORIES:
            raise ValueError(f"category must be one of {VALID_CATEGORIES}")
        return v

    @field_validator("occasion_tags", "trend_tags", mode="before")
    @classmethod
    def lowercase_tags(cls, v: list) -> list[str]:
        """Normalise all tags to lowercase at write time — matching never needs .lower() again."""
        return [t.lower().strip() for t in v]

    model_config = {
        "json_schema_extra": {
            "example": {
                "name": "White Linen Shirt",
                "category": "Tops",
                "color": "white",
                "fabric": "linen",
                "occasion_tags": ["casual", "formal"],
                "trend_tags": ["minimal"],
                "emoji": "👔",
                "image_url": None,
            }
        }
    }


class OutfitRequest(BaseModel):
    occasion: str
    trend: str
    include_accessories: bool = False
    exclude_item_ids: list[str] = Field(
        default_factory=list,
        description="Item IDs to skip — lets users request 'another outfit'",
    )

    @field_validator("occasion", "trend", mode="before")
    @classmethod
    def lowercase_fields(cls, v: str) -> str:
        return v.lower().strip()

    model_config = {
        "json_schema_extra": {
            "example": {
                "occasion": "casual",
                "trend": "minimal",
                "include_accessories": False,
                "exclude_item_ids": [],
            }
        }
    }
