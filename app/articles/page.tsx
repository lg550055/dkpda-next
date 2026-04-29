import ArticleCard from "@/components/ArticleCard";
import api from "@/lib/api";
import { Article } from "@/types";

export const dynamic = "force-dynamic";

export default async function ArticlesPage() {
  let articles: Article[] = [];
  try {
    const res = await api.get("/articles");
    articles = Array.isArray(res.data) ? res.data : [];
  } catch {
    // backend may not be running
  }

  return (
    <main className="articles-page">
      <div className="articles-page-header">
        <h1>All Articles</h1>
      </div>

      {articles.length === 0 ? (
        <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "3rem 0" }}>
          No articles available.
        </p>
      ) : (
        <div className="articles-list-grid">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      )}
    </main>
  );
}
