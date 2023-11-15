import path from "path";
import fs from "fs";
import fm from "front-matter";

export interface BlogArticle {
    title: string; // The title.
    date: string; // The date in the following format: YYYY-MM-DD hh:mm:ss YOUR_UTC_OFFSET.
    tags: string[]; // The tags. Not really used for now.
    markdown: string;
    authors: string[] | undefined; // Authors list.
    image: string | undefined; // This image will be put below the title, and next to the article in the articles list, and in the social embeds.
    imageMargin: string | undefined; // The margin of the image in the article list.
    imageHeight: string | undefined; // The height of the image in the article.
    teaser: string | undefined; // This text is used in the article list, and social embeds.
    path: string; // The directory name.
    makeSocialEmbedBig: boolean; // To make the image of the social embeds bigger.
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
                date: string;
                tags: string[] | undefined;
                teaser: string | undefined;
                authors: string[] | undefined;
                image: string | undefined;
                imageMargin: string | undefined;
                imageHeight: string | undefined;
                makeSocialEmbedBig: boolean | undefined;
            };
            if (attributes.date === undefined) {
                throw new Error(`Article ${dirEntry.name} does not have a date`);
            }

            // tags can be only a string, so we need to convert it to an array
            if (attributes.tags !== undefined && !Array.isArray(attributes.tags)) {
                attributes.tags = [attributes.tags];
            }
            
            // same for authors.
            if (attributes.authors !== undefined && !Array.isArray(attributes.authors)) {
                attributes.authors = [attributes.authors];
            }

            articles.push({
                title: attributes.title ?? "Untitled",
                date: attributes.date,
                tags: attributes["tags"] as string[] || [],
                markdown: result.body,
                teaser: attributes.teaser,
                authors: attributes.authors,
                image: attributes.image,
                imageMargin: attributes.imageMargin,
                imageHeight: attributes.imageHeight,
                path: encodeURIComponent(dirEntry.name),
                makeSocialEmbedBig: attributes.makeSocialEmbedBig ?? false,
            });
        }
    }
    return articles;
}