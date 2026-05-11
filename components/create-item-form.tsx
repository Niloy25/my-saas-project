"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const schema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be under 100 characters"),
  content: z
    .string()
    .max(500, "Content must be under 500 characters")
    .optional(),
});

type FormData = z.infer<typeof schema>;

async function createItem(data: FormData) {
  const res = await fetch("/api/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create item");
  return res.json();
}

export default function CreateItemForm() {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      reset();
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      className="space-y-3 mb-8"
    >
      <div>
        <input
          {...register("title")}
          type="text"
          placeholder="Title"
          className="w-full border border-gray-200 rounded-lg
               px-3 py-2 text-sm outline-none
               focus:border-gray-400"
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <textarea
          {...register("content")}
          placeholder="Content (optional)"
          className="w-full border border-gray-200 rounded-lg
               px-3 py-2 text-sm outline-none
               focus:border-gray-400 resize-none h-20"
        />
        {errors.content && (
          <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>
        )}
      </div>

      {mutation.isError && (
        <p className="text-red-500 text-xs">
          Something went wrong. Please try again.
        </p>
      )}

      <button
        type="submit"
        disabled={mutation.isPending}
        className="bg-black text-white text-sm px-4 py-2
             rounded-lg hover:bg-gray-800 disabled:opacity-50"
      >
        {mutation.isPending ? "Adding..." : "Add item"}
      </button>
    </form>
  );
}
