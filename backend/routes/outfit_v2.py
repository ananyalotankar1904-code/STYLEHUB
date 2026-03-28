from fastapi import APIRouter, HTTPException, Header
from database import db
# Wire up to the new models and logic v2
from models_v2 import OutfitRequest
from logic.outfit_logic_v2 import generate_outfit

router = APIRouter()


@router.post("/generate-outfit")
async def generate_outfit_endpoint(req: OutfitRequest, x_user_id: str = Header("guest")):
    if not req.occasion or not req.trend:
        raise HTTPException(
            status_code=400,
            detail={"success": False, "error": "Both 'occasion' and 'trend' are required"},
        )

    try:
        # Fetch wardrobe items from MongoDB or in-memory fallback
        items: list[dict] = []
        if db is not None:
            for doc in db["wardrobe"].find({"user_id": x_user_id}):
                doc["_id"] = str(doc["_id"])
                items.append(doc)
        else:
            from routes.wardrobe import _in_memory_store
            items = [i.copy() for i in _in_memory_store if i.get("user_id", "guest") == x_user_id]

        print(
            f"[GENERATE] occasion={req.occasion}, trend={req.trend}, "
            f"items={len(items)}, accessories={req.include_accessories}, "
            f"excluded={len(req.exclude_item_ids)}"
        )

        result = generate_outfit(
            items=items,
            occasion=req.occasion,
            trend=req.trend,
            include_accessories=req.include_accessories,
            exclude_item_ids=req.exclude_item_ids,
        )
        return result

    except Exception as e:
        print(f"[ERROR] Error generating outfit: {e}")
        raise HTTPException(status_code=500, detail={"success": False, "error": str(e)})
