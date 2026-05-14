"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const schema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  content: z.string().max(500).optional(),
});

type FormData = z.infer<typeof schema>;

type Item = {
  id: string;
  title: string;
  content: string | null;
};

type Props = {
  item?: Item; // optional — if passed, it's edit mode
  onDone?: () => void;
};

export default function ItemForm({ item, onDone }: Props) {
  const isEditing = !!item; // true if item is passed, false if not
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: item?.title ?? "",
      content: item?.content ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const url = isEditing ? `/api/items/${item.id}` : "/api/items";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to save");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      if (isEditing) {
        onDone?.(); // close edit mode
      } else {
        reset(); // clear form after create
      }
    },
  });

  return (
    <form
      onSubmit={handleSubmit((d) => mutation.mutate(d))}
      className="space-y-3"
    >
      <div>
        <input
          {...register("title")}
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

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="bg-black text-white text-sm px-4 py-2
               rounded-lg hover:bg-gray-800 disabled:opacity-50"
        >
          {mutation.isPending
            ? "Saving..."
            : isEditing
              ? "Save changes"
              : "Add item"}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={onDone}
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
