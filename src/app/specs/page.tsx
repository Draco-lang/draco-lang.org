import Article from "@/components/Article";
import "./page.css";
import { getSpecsInfo } from "@/server/github";

export default async function Page() {
  const articles = await getSpecsInfo();
  const intro = articles.find((article) => article.name === "Introduction")!;
  return (
    <>
      <Article markdown={intro.markdown} className="article-Introduction" />
      <style>
        {`
      .article-active-on-Introduction:hover {
        background-color: #00c8bd50 !important;
      }  
    `}
      </style>
    </>
  );
}
