import Link from "next/link";
import { Article } from "@/types";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export default function ArticleCard({
  article,
  featured = false,
}: {
  article: Article;
  featured?: boolean;
}) {
  if (featured) {
    return (
      <Link href={`/articles/${article.id}`}>
        <article className="article-featured">
          <div className="article-featured-img-wrap">
            {article.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={article.image_url}
                alt={article.title}
                className="article-featured-img"
              />
            )}
            <div className="article-featured-overlay">
              <span className="article-category">{article.category}</span>
              <h2 className="article-featured-title">{article.title}</h2>
            </div>
          </div>
          <div className="article-body">
            <p className="article-excerpt">{article.content}</p>
            <div className="article-meta">
              <span className="article-date">{formatDate(article.created_at)}</span>
              <span className="article-date">⇧ {article.upvotes}</span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/articles/${article.id}`}>
      <article className="article-card">
        {article.image_url && (
          <div className="card-img-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.image_url}
              alt={article.title}
              className="card-img"
              loading="lazy"
            />
          </div>
        )}
        <div className="card-body">
          <span className="article-category">{article.category}</span>
          <h3 className="card-title">{article.title}</h3>
          <p className="card-excerpt">{article.content}</p>
          <div className="article-meta">
            <span className="article-date">{formatDate(article.created_at)}</span>
            <span className="article-date">⇧ {article.upvotes}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
