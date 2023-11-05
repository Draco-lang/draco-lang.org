import Link from "next/link";
import "./page.css";
import { getBlogArticles } from "@/server/blog";

export default async function Page() {
  const articles = await getBlogArticles();
  // sort by date
  articles.sort((a, b) => (a.date > b.date ? -1 : 1));
  return (
    <div className="blog-entries">
      {articles.map((article, i) => (
        <Link key={i} href={`/blog/${article.path}`}>
          <div className="article-preview-left-part">
            <h1 className="article-preview-title">{article.title}</h1>
            <div>{article.teaser}</div>
          </div>
          {
            /* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text */
            article.image != undefined ? (
              <img
                src={article.image}
                style={{
                  margin: article.imageMargin,
                }}
              />
            ) : (
              <></>
            )
          }
        </Link>
      ))}
    </div>
  );
}
