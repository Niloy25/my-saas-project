"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ItemForm from "@/components/item-form";
import DeleteItemButton from "./delete-item-button";

type Item = {
  id: string;
  title: string;
  content: string | null;
  created_at: string;
};

async function fetchItems(): Promise<Item[]> {
  const res = await fetch("/api/items");
  if (!res.ok) throw new Error("Failed to fetch");
  const { data } = await res.json();
  return data;
}

export default function ItemsList() {
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    data: items,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["items"],
    queryFn: fetchItems,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  if (isLoading) return <p className="text-gray-400 text-sm">Loading...</p>;
  if (isError) return <p className="text-red-500 text-sm">Failed to load.</p>;
  if (!items?.length)
    return (
      <p className="text-gray-400 text-sm">No items yet. Add one above.</p>
    );

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white border border-gray-200 rounded-lg p-4"
        >
          {editingId === item.id ? (
            <ItemForm item={item} onDone={() => setEditingId(null)} />
          ) : (
            <>
              <p className="font-medium text-sm">{item.title}</p>
              {item.content && (
                <p className="text-gray-500 text-sm mt-1">{item.content}</p>
              )}
              <p className="text-gray-300 text-xs mt-2">
                {new Date(item.created_at).toLocaleDateString()}
              </p>
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => setEditingId(item.id)}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  Edit
                </button>
                <DeleteItemButton id={item.id} />
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
