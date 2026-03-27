import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/fashion_ai")

try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    client.server_info()  # Force connection to verify
    db = client["fashion_ai"]
    print("[OK] Connected to MongoDB Atlas")
except Exception as e:
    print(f"[WARNING] MongoDB connection warning: {e}")
    print("   Running with fallback — wardrobe routes will use in-memory store.")
    db = None
