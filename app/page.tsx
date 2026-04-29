import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import api from "@/lib/api";
import { Article } from "@/types";

export const dynamic = "force-dynamic";


export default async function Home() {
  let articles: Article[] = [];
  try {
    const res = await api.get("/articles");
    articles = Array.isArray(res.data) ? res.data : [];
  } catch {
    // backend may not be running; render empty state gracefully
  }

  const trending = [...articles]
    .sort((a, b) => b.upvotes - a.upvotes)
    .slice(0, 5);

  return (
    <main className="page-main">
      <div className="content-wrap">
        {/* Main articles column */}
        <section className="articles-col">
          {articles.length === 0 ? (
            <p style={{ color: "var(--text-muted)", padding: "3rem 0", textAlign: "center" }}>
              No articles available. Make sure the backend is running.
            </p>
          ) : (
            <>
              <span className="section-label">Top Story</span>
              <ArticleCard article={articles[0]} featured />

              {articles.length > 1 && (
                <>
                  <span className="section-label">Latest Stories</span>
                  <div className="articles-grid">
                    {articles.slice(1).map((a) => (
                      <ArticleCard key={a.id} article={a} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </section>

        {/* Sidebar — compact trending only, no full article cards */}
        <aside className="sidebar">
          <div className="sidebar-widget">
            <h4 className="widget-title">Trending</h4>
            <ol className="trending-list">
              {trending.map((a, i) => (
                <li key={a.id}>
                  <Link href={`/articles/${a.id}`} className="trending-link">
                    <span className="trending-num">{i + 1}</span>
                    <div className="trending-item-inner">
                      <span className="trending-cat">{a.category}</span>
                      <p className="trending-title">{a.title}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          </div>

          <div className="sidebar-quote">
            <blockquote>&ldquo;Satire is the closest thing to the truth.&rdquo;</blockquote>
            <cite>— Some pundit, probably</cite>
          </div>

          <div className="sidebar-disclaimer">
            <p className="disclaimer-label">DISCLAIMER</p>
            <p>Nothing here is real. Any resemblance to actual events is a coincidence and also kind of depressing.</p>
          </div>
        </aside>
      </div>
    </main>
  );
}
