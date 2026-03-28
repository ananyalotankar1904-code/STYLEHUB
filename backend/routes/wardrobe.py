from fastapi import APIRouter, HTTPException, Header
from bson import ObjectId
from database import db
from models_v2 import ClothingItem

router = APIRouter()

# In-memory fallback if MongoDB is unavailable
_in_memory_store: list = []


def _get_collection():
    if db is not None:
        return db["wardrobe"]
    return None


@router.post("/add-item")
async def add_item(item: ClothingItem, x_user_id: str = Header("guest")):
    try:
        item.user_id = x_user_id # enforce the header
        item_dict = item.model_dump()
        item_dict["created_at"] = item_dict["created_at"].isoformat()

        collection = _get_collection()
        if collection is not None:
            result = collection.insert_one(item_dict)
            item_dict["_id"] = str(result.inserted_id)
            print(f"[SAVE] Saved item: {item.name} for user: {x_user_id}")
            return {"success": True, "item_id": item_dict["_id"], "item": item_dict}
        else:
            # In-memory fallback
            item_dict["_id"] = str(len(_in_memory_store) + 1)
            _in_memory_store.append(item_dict)
            return {"success": True, "item_id": item_dict["_id"], "item": item_dict}

    except Exception as e:
        print(f"[ERROR] Error saving item: {e}")
        raise HTTPException(status_code=500, detail={"success": False, "error": str(e)})


@router.get("/wardrobe")
async def get_wardrobe(x_user_id: str = Header("guest")):
    try:
        collection = _get_collection()
        if collection is not None:
            items = []
            for doc in collection.find({"user_id": x_user_id}):
                doc["_id"] = str(doc["_id"])
                items.append(doc)
        else:
            items = [i for i in _in_memory_store if i.get("user_id", "guest") == x_user_id]

        print(f"[FETCH] Fetched {len(items)} items for user: {x_user_id}")
        return {"success": True, "count": len(items), "items": items}

    except Exception as e:
        print(f"[ERROR] Error fetching wardrobe: {e}")
        raise HTTPException(status_code=500, detail={"success": False, "error": str(e)})


@router.delete("/wardrobe/{item_id}")
async def delete_item(item_id: str, x_user_id: str = Header("guest")):
    try:
        collection = _get_collection()
        if collection is not None:
            result = collection.delete_one({"_id": ObjectId(item_id), "user_id": x_user_id})
            if result.deleted_count == 0:
                raise HTTPException(status_code=404, detail={"success": False, "error": "Item not found or unauthorised"})
        else:
            global _in_memory_store
            original_len = len(_in_memory_store)
            _in_memory_store = [i for i in _in_memory_store if not (i["_id"] == item_id and i.get("user_id", "guest") == x_user_id)]
            if len(_in_memory_store) == original_len:
                raise HTTPException(status_code=404, detail={"success": False, "error": "Item not found or unauthorised"})

        print(f"[DELETE] Deleted item: {item_id}")
        return {"success": True, "message": "Item deleted"}

    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR] Error deleting item: {e}")
        raise HTTPException(status_code=500, detail={"success": False, "error": str(e)})
