from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ClothingItem(BaseModel):
    id: Optional[str] = None
    name: str
    category: str  # "Tops" | "Bottoms" | "Outerwear" | "Footwear" | "Accessories"
    color: str
    fabric: str
    occasion_tags: list[str]
    trend_tags: list[str]
    emoji: str
    image_url: Optional[str] = None
    imageSource: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

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

    model_config = {
        "json_schema_extra": {
            "example": {
                "occasion": "casual",
                "trend": "minimal",
            }
        }
    }
