import Link from "next/link";
import "./page.css";
import { getBlogArticles } from "@/utils/blog";

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
            <div className="article-teaser">{article.teaser}</div>
            <div className="article-metadata">
              <span className="muted-color">Posted </span>
              <span>
                {new Date(article.date).toLocaleString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="muted-color">&nbsp;&nbsp;Tags </span>
              {console.log(article) && ""}
              <span>{article.tags}</span>
              <span className="muted-color">&nbsp;&nbsp;By </span>
              <span>{article.authors?.join(", ")}</span>
            </div>
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
