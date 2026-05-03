import api from "@/lib/api";
import { resolveImageUrl } from "@/lib/imageUrl";
import { Article } from "@/types";
import LikeButton from "@/components/LikeButton";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await api.get(`/articles/${id}`);
  const article: Article = res.data;

  const date = new Date(article.created_at).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const imageUrl = resolveImageUrl(article.image_url);

  return (
    <div className="article-detail">
      {imageUrl && (
        <div className="article-detail-hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt={article.title} />
        </div>
      )}

      <h1>{article.title}</h1>

      <div className="article-detail-meta">
        <span className="article-category">{article.category}</span>
        <span className="article-detail-date">{date}</span>
      </div>

      <p className="article-detail-body">{article.content}</p>

      <div className="article-detail-actions">
        <LikeButton
          articleId={article.id}
          initialUpvotes={article.upvotes}
          initialDownvotes={article.downvotes}
          userVote={article.user_vote}
        />
      </div>
    </div>
  );
}
