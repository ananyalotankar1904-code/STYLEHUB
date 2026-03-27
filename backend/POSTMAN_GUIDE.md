# StyleHub Postman Guide

## Base URL
```
http://localhost:8000
```

---

## 1. Health Check

**GET** `/test`

_Response:_
```json
{
  "status": "ok",
  "message": "Fashion AI backend is running"
}
```

---

## 2. Add a Clothing Item

**POST** `/add-item`

_Headers:_ `Content-Type: application/json`

_Body:_
```json
{
  "name": "White Linen Shirt",
  "category": "top",
  "color": "white",
  "fabric": "linen",
  "occasion_tags": ["casual", "formal"],
  "trend_tags": ["minimal"],
  "image_url": null
}
```

_Response:_
```json
{
  "success": true,
  "item_id": "64abc123def456",
  "item": { ... }
}
```

---

## 3. Get Full Wardrobe

**GET** `/wardrobe`

_Response:_
```json
{
  "success": true,
  "count": 5,
  "items": [ ... ]
}
```

---

## 4. Delete a Wardrobe Item

**DELETE** `/wardrobe/{item_id}`

_Example:_ `DELETE /wardrobe/64abc123def456`

_Response:_
```json
{
  "success": true,
  "message": "Item deleted"
}
```

_404 if not found:_
```json
{
  "success": false,
  "error": "Item not found"
}
```

---

## 5. Generate an Outfit

**POST** `/generate-outfit`

_Headers:_ `Content-Type: application/json`

_Body:_
```json
{
  "occasion": "casual",
  "trend": "minimal"
}
```

_Response:_
```json
{
  "occasion": "casual",
  "trend": "minimal",
  "outfit": {
    "top": { "name": "White Linen Shirt", "category": "top", "color": "white", "fabric": "linen" },
    "bottom": { "name": "Beige Straight Trousers", "category": "bottom", "color": "beige", "fabric": "cotton" },
    "shoes": { "name": "White Leather Sneakers", "category": "shoes", "color": "white", "fabric": "leather" }
  },
  "style_note": "Clean lines, neutral tones, understated elegance...",
  "missing_categories": [],
  "trend_profile": {
    "description": "Clean lines, neutral tones, understated elegance",
    "preferred_colors": ["white", "black", "grey", "beige"],
    "preferred_fabrics": ["cotton", "linen", "wool"],
    "avoid": ["loud prints", "neon"]
  },
  "source": "wardrobe"
}
```

---

## Available Trends
- `minimal`
- `streetwear`
- `formal`

## Available Occasions (examples)
- `casual`
- `formal`
- `work`
- `date`
- `party`
- `gym`
