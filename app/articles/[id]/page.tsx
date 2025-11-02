import api from "@/lib/api";
import { Article } from "@/types";
import Image from "next/image";
import LikeButton from "@/components/LikeButton";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // ← MUST AWAIT
  const res = await api.get(`/articles/${id}`);
  const article: Article = res.data;

  return (
    <article className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
      {article.image_url && (
        <div className="relative h-96 mb-6 rounded-lg overflow-hidden">
          <Image src={article.image_url.substring(1)} alt="" fill className="object-cover" />
        </div>
      )}
      <div className="flex gap-4 text-sm text-gray-600 mb-4">
        <span>By User #{article.author_id}</span>
        <span>{new Date(article.created_at).toLocaleDateString()}</span>
        <span>{article.category.toUpperCase()}</span>
      </div>
      <p className="whitespace-pre-wrap text-lg leading-relaxed">{article.content}</p>
      <div className="mt-8">
        <LikeButton
          articleId={article.id}
          initialUpvotes={article.upvotes}
          initialDownvotes={article.downvotes}
          userVote={article.user_vote}
        />
      </div>
    </article>
  );
}