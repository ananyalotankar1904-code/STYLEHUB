"use client";

import { ClothingItem } from "@/lib/types";
import { Trash2, Tag } from "lucide-react";

interface Props {
  item: ClothingItem;
  onDelete?: (id: string) => void;
}

export default function ClothingCard({ item, onDelete }: Props) {
  return (
    <div className="clothing-card">
      <div className="clothing-card-emoji">
        {item.imageSource ? (
          <img
            src={item.imageSource}
            alt={item.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "var(--radius-sm)" }}
          />
        ) : (
          item.emoji
        )}
      </div>
      <div className="clothing-card-body">
        <p className="clothing-card-name">{item.name}</p>
        <p className="clothing-card-meta">
          {item.color} · {item.fabric}
        </p>
        <div className="clothing-card-tags">
          {item.occasion_tags.slice(0, 2).map((tag) => (
            <span key={tag} className="tag">
              <Tag size={10} />
              {tag}
            </span>
          ))}
        </div>
      </div>
      {onDelete && (
        <button
          onClick={() => onDelete(item.id)}
          className="clothing-card-delete"
          aria-label="Delete item"
        >
          <Trash2 size={15} />
        </button>
      )}
    </div>
  );
}
