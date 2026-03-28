# Install: pip install -r requirements.txt
# Run:     uvicorn main:app --reload
# Docs:    http://localhost:8000/docs

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.wardrobe import router as wardrobe_router
# Using the enhanced outfit router
from routes.outfit_v2 import router as outfit_router

app = FastAPI(
    title="Fashion AI Assistant API",
    description="StyleHub backend — wardrobe management & outfit generation",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(wardrobe_router, tags=["Wardrobe"])
app.include_router(outfit_router, tags=["Outfit"])


@app.get("/")
def home():
    return {
        "message": "Welcome to StyleHub AI API",
        "endpoints": ["/wardrobe", "/generate-outfit", "/test", "/docs"]
    }


@app.get("/test", tags=["Health"])
def health_check():
    return {"status": "ok", "message": "Fashion AI backend is running"}
