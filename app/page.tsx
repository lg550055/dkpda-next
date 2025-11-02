import ArticleCard from "@/components/ArticleCard";
import api from "@/lib/api";
import { Article } from "@/types";

export default async function Home() {
  const res = await api.get("/articles");
  const articles: Article[] = res.data;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dikipedia -your daily dose of satire</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
    </div>
  );
}