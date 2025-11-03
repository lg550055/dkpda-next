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
  <div>
  <h2>
        {article ? "Edit Article" : "Create New Article"}
      </h2>

  <form onSubmit={handleSubmit(onSubmit)}>
        {/* Title */}
        <div>
          <label htmlFor="title">
            Title
          </label>
          <input
            {...register("title")}
            id="title"
            placeholder="Enter a catchy title..."
            
          />
          {errors.title && (
            <p>{errors.title.message}</p>
          )}
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content">
            Content <span className="text-gray-500">({wordCount}/300 words)</span>
          </label>
          <textarea
            {...register("content")}
            id="content"
            rows={8}
            placeholder="Write your satire..."
          />
          {errors.content && (
            <p>{errors.content.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category">
            Category
          </label>
          <select
            {...register("category")}
            id="category"
            
          >
            {categoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <p>{errors.category.message}</p>
          )}
        </div>

        {/* Image URL */}
        <div>
          <label htmlFor="image_url">
            Image URL (optional)
          </label>
          <input
            {...register("image_url")}
            id="image_url"
            type="url"
            placeholder="https://example.com/image.jpg"
            
          />
          {errors.image_url && (
            <p>{errors.image_url.message}</p>
          )}
        </div>

        {/* Submit */}
  <div>
          <button
            type="submit"
            disabled={isSubmitting}
            
          >
            {isSubmitting ? "Saving..." : article ? "Update" : "Publish"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}