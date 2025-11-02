"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

const categoryOptions = [
  { value: "CRONY", label: "Crony" },
  { value: "NONSENSE", label: "Nonsense" },
  { value: "AI", label: "AI Please Save Us" },
  { value: "GRIFT", label: "Grift" },
  { value: "GRAFT", label: "Graft" },
] as const;

const articleSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  content: z.string().min(1, "Content is required").refine(
    (val) => val.split(/\s+/).length <= 300,
    "Content must be 300 words or fewer"
  ),
  category: z.enum(["CRONY", "NONSENSE", "AI", "GRIFT", "GRAFT"]),
  image_url: z.string().url("Invalid URL").optional().or(z.literal("")),
});

type ArticleFormData = z.infer<typeof articleSchema>;

type Props = {
  article?: {
    id: number;
    title: string;
    content: string;
    category: string;
    image_url: string | null;
  };
  onSuccess?: () => void;
};

export default function ArticleForm({ article, onSuccess }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: article
      ? {
          title: article.title,
          content: article.content,
          category: article.category.toUpperCase() as any,
          image_url: article.image_url || "",
        }
      : {
          category: "GRAFT",
        },
  });

  const wordCount = watch("content")?.split(/\s+/).filter(Boolean).length || 0;

  const onSubmit = async (data: ArticleFormData) => {
    setIsSubmitting(true);
    try {
      if (article) {
        // Update
        await api.put(`/articles/${article.id}`, data);
      } else {
        // Create
        await api.post("/articles", data);
      }
      onSuccess?.();
      router.push("/articles");
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to save article");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">
        {article ? "Edit Article" : "Create New Article"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            {...register("title")}
            id="title"
            placeholder="Enter a catchy title..."
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content <span className="text-gray-500">({wordCount}/300 words)</span>
          </label>
          <textarea
            {...register("content")}
            id="content"
            rows={8}
            placeholder="Write your satire..."
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            {...register("category")}
            id="category"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            {categoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        {/* Image URL */}
        <div>
          <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
            Image URL (optional)
          </label>
          <input
            {...register("image_url")}
            id="image_url"
            type="url"
            placeholder="https://example.com/image.jpg"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.image_url && (
            <p className="mt-1 text-sm text-red-600">{errors.image_url.message}</p>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : article ? "Update" : "Publish"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}