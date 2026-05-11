"use client";

import { useQuery } from "@tanstack/react-query";

type Item = {
  id: string;
  title: string;
  content: string | null;
  created_at: string;
};

async function fetchItems(): Promise<Item[]> {
  const res = await fetch("/api/items");
  if (!res.ok) throw new Error("Failed to fetch items");
  const { data } = await res.json();
  return data;
}

export default function ItemsList() {
  const {
    data: items,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["items"],
    queryFn: fetchItems,
  });

  if (isLoading)
    return <p className="text-gray-400 text-sm">Loading items...</p>;

  if (isError)
    return <p className="text-red-500 text-sm">Failed to load items.</p>;

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
          <p className="font-medium text-sm">{item.title}</p>
          {item.content && (
            <p className="text-gray-600 text-sm mt-1">{item.content}</p>
          )}
          <p className="text-gray-400 text-xs mt-2">
            {new Date(item.created_at).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
