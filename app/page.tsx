import ArticleCard from "@/components/ArticleCard";
import api from "@/lib/api";
import { Article } from "@/types";

export default async function Home() {
  const res = await api.get("/articles");
  const articles: Article[] = res.data;

  return (
  <div>
  <h1>Dikipedia -your daily dose of satire</h1>
  <div>
        {articles.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
    </div>
  );
}