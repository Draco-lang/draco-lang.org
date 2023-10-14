import Article from "@/components/Article";
import "./page.css";

export default function Page() {
  return (
    <>
      <Article articleName="Introduction" className="article-Introduction" />
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
