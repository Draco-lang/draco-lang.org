import Article from "@/components/Article";
import { getBlogArticles } from "@/server/blog";

export async function generateStaticParams() {
  const articles = await getBlogArticles();
  return articles.map((article) => ({
    articleName: article.path,
  }));
}

export default async function Page({
  params,
}: {
  params: { articleName: string };
}) {
  const { articleName } = params;
  const articles = await getBlogArticles();
  const article = articles.find((article) => article.path === articleName)!;

  return (
    <div className={`article-${articleName}`}>
      <Article markdown={article.markdown} />
    </div>
  );
}
