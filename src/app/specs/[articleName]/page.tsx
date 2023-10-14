import Article from "@/components/Article";
import { getSpecsInfo } from "@/server/github";

export async function generateStaticParams() {
  const specs = await getSpecsInfo();
  return specs.map((post) => ({
    articleName: post.name,
  }));
}

export default async function Page({
  params,
}: {
  params: { articleName: string };
}) {
  const { articleName } = params;
  return (
    <div className={`article-${articleName}`}>
      <Article articleName={articleName} />
      <style>
        {
          `
          body:has(.article-${articleName}) .article-active-on-${articleName} {
            background-color: #00c8bd50;
          }
          .article-active-on-${articleName}:hover {
            background-color: #00c8bd50 !important;
          }
          `
        }
        
      </style>
    </div>
  );
}
