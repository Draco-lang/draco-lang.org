import path from "path";
import fs from "fs";
import fm from "front-matter";

export interface BlogArticle {
    title: string;
    date: string | undefined;
    tags: string[];
    markdown: string;
    authors: string[] | undefined;
    image: string | undefined;
    teaser: string | undefined;
    path: string;
}

export async function getBlogArticles(): Promise<BlogArticle[]> {
    // list directories in /blog
    // for each directory, read the markdown file article.md
    const dir = await fs.promises.opendir(path.join(process.cwd(), "public/blog"));
    const articles: BlogArticle[] = [];
    for await (const dirEntry of dir) {
        if (dirEntry.isDirectory()) {
            const articlePath = path.join(dir.path, dirEntry.name, "article.md");
            if (!fs.existsSync(articlePath)) continue;

            const article = await fs.promises.readFile(articlePath, "utf-8");

            const result = fm(article);
            const attributes = result.attributes as {
                title: string | undefined;
                date: string | undefined;
                tags: string[] | undefined;
                teaser: string | undefined;
                authors: string[] | undefined;
                image: string | undefined;
            };
            articles.push(
                {
                    title: attributes.title ?? "Untitled",
                    date: attributes.date,
                    tags: attributes["tags"] as string[] || [],
                    markdown: result.body,
                    teaser: attributes.teaser,
                    authors: attributes.authors,
                    image: attributes.image,
                    path: dirEntry.name
                }
            );
        }
    }
    return articles;
}