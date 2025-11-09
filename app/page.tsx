import ArticleCard from "@/components/ArticleCard";
import api from "@/lib/api";
import { Article } from "@/types";

export default async function Home() {
  const res = await api.get("/articles");
  const articles: Article[] = res.data;

  return (
    <div>
      <div className="hero">
        <h1>Dikipedia -your daily dose of satire</h1>
        <p>Dikipedia -your daily dose of satire</p>
      </div>

      <main>
        <section>
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </section>

        <aside>
          <h3>Trending...</h3>
          {articles
            .sort((a, b) => b.upvotes - a.upvotes)
            .slice(0, 5)
            .map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
        </aside>
      </main>
    </div>
  );
}