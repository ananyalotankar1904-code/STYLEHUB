from fastapi import APIRouter, HTTPException
from database import db
from models import OutfitRequest
from logic.outfit_logic import generate_outfit

router = APIRouter()


@router.post("/generate-outfit")
async def generate_outfit_endpoint(req: OutfitRequest):
    if not req.occasion or not req.trend:
        raise HTTPException(
            status_code=400,
            detail={"success": False, "error": "Both 'occasion' and 'trend' are required"},
        )

    try:
        # Fetch wardrobe items
        items = []
        if db is not None:
            for doc in db["wardrobe"].find():
                doc["_id"] = str(doc["_id"])
                items.append(doc)
        else:
            from routes.wardrobe import _in_memory_store
            items = _in_memory_store.copy()

        print(f"[GENERATE] Generating outfit — occasion: {req.occasion}, trend: {req.trend}, items: {len(items)}")
        result = generate_outfit(items, req.occasion, req.trend)
        return result

    except Exception as e:
        print(f"[ERROR] Error generating outfit: {e}")
        raise HTTPException(status_code=500, detail={"success": False, "error": str(e)})
