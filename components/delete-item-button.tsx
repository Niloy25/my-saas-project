"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function DeleteItemButton({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/items/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });

  if (confirming) {
    return (
      <div className="flex gap-2 items-center">
        <span className="text-xs text-gray-500">Sure?</span>
        <button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="text-xs text-red-500 hover:text-red-700
               disabled:opacity-50"
        >
          {mutation.isPending ? "Deleting..." : "Yes, delete"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-xs text-gray-400 hover:text-red-500"
    >
      Delete
    </button>
  );
}
