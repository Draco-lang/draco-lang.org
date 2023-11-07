import { createTokenAuth } from "@octokit/auth-token";
import { Octokit } from "@octokit/rest";
import { components } from "@octokit/openapi-types";

let instance: Octokit;

export async function getOctokit() {
    if (instance !== undefined) return instance;

    if (process.env.GITHUB_TOKEN !== undefined && process.env.GITHUB_TOKEN.length > 0) {
        const auth = createTokenAuth(process.env.GITHUB_TOKEN);
        const authentication = await auth();
        instance = new Octokit({
            auth: authentication.token
        });
    } else {
        instance = new Octokit();
    }

    return instance;
}

export async function getSpecsInfo(): Promise<{ name: string, markdown: string }[]> {
    const octokit = await getOctokit();

    const response = await octokit.repos.getContent({
        owner: "Draco-lang",
        repo: "Language-suggestions",
        path: "Specification"
    });
    const data = response.data as components["schemas"]["content-directory"];
    return Promise.all(
        data.filter(entry => entry.name.endsWith(".md"))
            .map(async file => {
                return {
                    name: file.name.replace(".md", ""),
                    markdown: await fetch(file.download_url!).then(r => r.text())
                };
            })
    );
}