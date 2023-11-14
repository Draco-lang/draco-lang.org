import Article from "@/components/Article";
import "./page.css";
import { getSpecsInfo } from "@/utils/github";

export default async function Page() {
  const articles = await getSpecsInfo();
  const intro = articles.find((article) => article.name === "Introduction")!;
  return (
    <>
      <Article markdown={intro.markdown} className="article-Introduction" />
      <style>
        {`
      @media (max-width: 650px) {
        .specs-submenu {
          display: flex;
        }
      }
      .article-active-on-Introduction:hover {
        background-color: #00c8bd50 !important;
      }  
    `}
      </style>
    </>
  );
}
