import ArticleCard from "@/components/ArticleCard";
import api from "@/lib/api";
import { Article } from "@/types";

export default async function ArticlesPage() {
  const res = await api.get("/articles");
  const articles: Article[] = res.data;

  return (
    <div>
      <main>
        <h1>All Articles</h1>
        <section>
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </section>
      </main>
    </div>
  );
}
