import Article from "@/components/Article";
import { getBlogArticles } from "@/server/blog";
import CommentScript from "./CommentScript";

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
  let { articleName } = params;

  // https://github.com/vercel/next.js/issues/54730
  if (process.env.NODE_ENV === "production") {
    articleName = decodeURIComponent(articleName);
  }

  const articles = await getBlogArticles();
  const article = articles.find((article) => article.path === articleName)!;

  return (
    <div className={`article-${articleName}`}>
      <Article markdown={article.markdown} />
      <CommentScript />
    </div>
  );
}
