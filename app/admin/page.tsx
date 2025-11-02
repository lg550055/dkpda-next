import ArticleForm from "@/components/ArticleForm";
import api from "@/lib/api";

export default async function Admin() {
  const res = await api.get("/articles");
  const articles = res.data;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      <ArticleForm />
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">All Articles</h2>
        {articles.map((a: any) => (
          <div key={a.id} className="flex justify-between items-center p-3 border-b">
            <span>{a.punchline}</span>
            <form action={`/api/delete-article`} method="post">
              <input type="hidden" name="id" value={a.id} />
              <button className="text-red-600">Delete</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}