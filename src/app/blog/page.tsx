import "./page.css";
import { getBlogArticles } from "@/server/blog";

export default async function Page() {
  const articles = await getBlogArticles();
  return (
    <div className="blog-entries">
      {articles.map((article, i) => (
        <div key={i}>
          <div className="article-preview-left-part">
            <h2 className="article-preview-title">{article.title}</h2>
            <div>{article.teaser}</div>
          </div>
            {
              // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
            article.image != undefined ? (<img src={article.image} />) : (<></>)
            }
        </div>
      ))}
    </div>
  );
}
