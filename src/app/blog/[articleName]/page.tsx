import Article from "@/components/Article";
import { getBlogArticles } from "@/utils/blog";
import CommentScript from "./CommentScript";
import "./page.css";
import Link from "next/link";
import metadata from "@/utils/metadata";
import { Metadata } from "next";
import sharp from "sharp";
import { promises as fs } from "fs";
import ArticleNameParams from "@/utils/ArticleNameParams";
import path from "path";

export async function generateStaticParams() {
  const articles = await getBlogArticles();
  return articles.map((article) => ({
    // get filename without extension from path
    articleName: encodeURIComponent(path.basename(path.dirname(article.path))),
  }));
}

export async function generateMetadata({ params }: ArticleNameParams): Promise<Metadata> {
  let { articleName } = params;

  // https://github.com/vercel/next.js/issues/54730
  if (process.env.NODE_ENV === "production") {
    articleName = decodeURIComponent(articleName);
  }

  const articles = await getBlogArticles();
  const article = articles.find((article) => path.basename(path.dirname(article.path)) === articleName)!;
  if (article.image !== undefined) {
    const filePath = `./public${article.image}`;
    const svgBuffer = await fs.readFile(filePath);
    const imageUrl = `generated/${articleName}-cover.png`;
    await sharp(svgBuffer).png().toFile(`./public/${imageUrl}`);

    return metadata({
      title: `The Draco Blog - ${article.title}`,
      description: article.teaser,
      imagePng: `https://draco-lang.org/${imageUrl}`,
      goBig: article.makeSocialEmbedBig,
    });
  }

  return metadata({
    title: `The Draco Blog - ${article.title}`,
    description: article.teaser,
    imagePng: "https://draco-lang.org/generated/Logo-Short-Inverted-Outline.png",
    goBig: false,
  });
}

export default async function Page({ params }: ArticleNameParams) {
  let { articleName } = params;

  // https://github.com/vercel/next.js/issues/54730
  if (process.env.NODE_ENV === "production") {
    articleName = decodeURIComponent(articleName);
  }

  const articles = await getBlogArticles();
  const article = articles.find((article) => path.basename(path.dirname(article.path)) === articleName)!;
  articles.sort((a, b) => (a.date > b.date ? -1 : 1));
  const articleIndex = articles.indexOf(article);
  const previousArticle = articles[articleIndex + 1];
  const nextArticle = articles[articleIndex - 1];
  const date = new Date(article.date);
  const formattedDate = date.toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className={`article-${articleName}`}>
      <div className="article-header">
        <h1>{article.title}</h1>
        <div className="article-meta">
          <span className="article-date">
            <span className="muted-color"> Posted: </span>
            <time>{formattedDate}</time>
          </span>
          {article.tags.length === 0 ? (
            <></>
          ) : (
            <span className="article-tags">
              <span className="muted-color"> Tags: </span>
              {article.tags}
            </span>
          )}
          <span className="article-author">
            <span className="muted-color"> By: </span>
            {article.authors?.join(", ")}
          </span>
        </div>
        {article.image === undefined ? (
          <></>
        ) : (
          <img
            src={article.image}
            style={{
              height: article.imageHeight,
            }}
          />
        )}
      </div>

      <Article markdown={article.markdown} markdownFilePath={article.path} />
      <div className="article-footer">
        <div className="footer-oldnew">
          {previousArticle === undefined ? (
            <></>
          ) : (
            <Link href={`/blog/${previousArticle!.path}`}>
              <div>
                <span>older</span>
                <p>{previousArticle!.title}</p>
              </div>
            </Link>
          )}
          {nextArticle === undefined ? (
            <></>
          ) : (
            <Link href={`/blog/${nextArticle!.path}`}>
              <div>
                <span>newer</span>
                <p>{nextArticle!.title}</p>
              </div>
            </Link>
          )}
        </div>
        <CommentScript />
      </div>
    </div>
  );
}
