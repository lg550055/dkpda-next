import Image from "next/image";
import Link from "next/link";
import { Article } from "@/types";

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/articles/${article.id}`}>
      <div className="card">
        {article.image_url && (
          <div className="card-image">
            <Image
              src={article.image_url.substring(1)}
              alt={article.title}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        )}
        <div>
          <h3>{article.title}</h3>
          <p>{article.content}</p>
          <p>
            {article.category.toUpperCase()} • {new Date(article.created_at).toLocaleDateString()}
          </p>
          <div>
            <span>Up {article.upvotes}</span>
            <span>Down {article.downvotes}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}