import { useState, useEffect } from "react";
import { OutfitItem } from "@/lib/types";

export interface HistoryRecord {
  id: string;
  date: string;
  occasion: string;
  trend: string;
  top: OutfitItem | null;
  bottom: OutfitItem | null;
  shoes: OutfitItem | null;
  outerwear?: OutfitItem | null;
  accessory?: OutfitItem | null;
}

export function useOutfitHistory() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("stylehub_outfit_history");
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load outfit history", e);
    }
  }, []);

  const saveOutfit = (record: Omit<HistoryRecord, "id" | "date">) => {
    const newRecord: HistoryRecord = {
      ...record,
      id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
      date: new Date().toISOString(),
    };
    
    setHistory((prev) => {
      // Prepend and keep last 20
      const updated = [newRecord, ...prev].slice(0, 20);
      try {
        localStorage.setItem("stylehub_outfit_history", JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save outfit history", e);
      }
      return updated;
    });
  };

  const clearHistory = () => {
    try {
      localStorage.removeItem("stylehub_outfit_history");
      setHistory([]);
    } catch (e) {
      console.error("Failed to clear outfit history", e);
    }
  };

  return { history, saveOutfit, clearHistory };
}
