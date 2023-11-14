import Article from "@/components/Article";
import ArticleNameParams from "@/utils/ArticleNameParams";
import { getSpecsInfo } from "@/utils/github";

export async function generateStaticParams() {
  const specs = await getSpecsInfo();
  return specs.map((post) => ({
    articleName: post.name,
  }));
}

export default async function Page({ params }: ArticleNameParams) {
  const { articleName } = params;
  const specs = await getSpecsInfo();
  const spec = specs.find((spec) => spec.name === articleName)!;
  return (
    <div className={`article-${articleName}`}>
      <Article markdown={spec.markdown} />
      <style>
        {`
          @media (max-width: 650px) {
            .specs-submenu {
              display: flex;
            }
          }
          body:has(.article-${articleName}) .article-active-on-${articleName} {
            background-color: #00c8bd50;
          }
          .article-active-on-${articleName}:hover {
            background-color: #00c8bd50 !important;
          }
          `}
      </style>
    </div>
  );
}
