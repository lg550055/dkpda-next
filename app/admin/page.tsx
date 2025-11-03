import ArticleForm from "@/components/ArticleForm";
import api from "@/lib/api";

export default async function Admin() {
  const res = await api.get("/articles");
  const articles = res.data;

  return (
  <div>
  <h1>Admin Panel</h1>
      <ArticleForm />
  <div>
  <h2>All Articles</h2>
        {articles.map((a: any) => (
          <div key={a.id}>
            <span>{a.punchline}</span>
            <form action={`/api/delete-article`} method="post">
              <input type="hidden" name="id" value={a.id} />
              <button>Delete</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}