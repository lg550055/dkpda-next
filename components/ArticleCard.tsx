import Image from "next/image";
import Link from "next/link";
import { Article } from "@/types";

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/articles/${article.id}`} className="block">
      <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
        {article.image_url && (
          <div className="relative h-48">
            <Image
              src={article.image_url.substring(1)}
              alt={article.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2 line-clamp-2">{article.title}</h3>
          <p className="text-sm text-gray-600">
            {article.category.toUpperCase()} • {new Date(article.created_at).toLocaleDateString()}
          </p>
          <div className="flex gap-2 mt-2 text-sm">
            <span>Up {article.upvotes}</span>
            <span>Down {article.downvotes}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}