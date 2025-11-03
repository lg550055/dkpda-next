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
    <article>
      <h1>{article.title}</h1>
      {article.image_url && (
        <div className="image-hero">
          <Image
            src={article.image_url.substring(1)}
            alt={article.title || "Article image"}
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
      )}
      <div>
        <span>By User #{article.author_id}</span>
        <span>{new Date(article.created_at).toLocaleDateString()}</span>
        <span>{article.category.toUpperCase()}</span>
      </div>
    <p>{article.content}</p>
    <div>
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