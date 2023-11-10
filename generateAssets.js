const { Octokit } = require("@octokit/rest");
const fs = require("fs");
const { createTokenAuth } = require("@octokit/auth-token");
const sharp = require("sharp");

const fullLogo = {
    light: "https://raw.githubusercontent.com/Draco-lang/Language-suggestions/main/Resources/Logo-Long.svg",
    dark: "https://raw.githubusercontent.com/Draco-lang/Language-suggestions/main/Resources/Logo-Long-Inverted.svg"
};
const shortLogo = {
    light: "https://raw.githubusercontent.com/Draco-lang/Language-suggestions/main/Resources/Logo-Short.svg",
    dark: "https://raw.githubusercontent.com/Draco-lang/Language-suggestions/main/Resources/Logo-Short-Inverted.svg"
};
const githubLogo = {
    light: "prebuild_assets/github-mark.svg",
    dark: "prebuild_assets/github-mark-white.svg"
};
const emojis = [];

async function main() {
    if (!fs.existsSync("public/generated")) {
        fs.mkdirSync("public/generated", { recursive: true });
    }

    await downloadThemedImage(fullLogo, "public/generated/Logo-Long.svg", true);
    await downloadThemedImage(shortLogo, "public/generated/Logo-Short.svg", true);
    await downloadThemedImage(githubLogo, "public/generated/github-logo.svg", false);
    await downloadAndConvertSvgToPng("https://raw.githubusercontent.com/Draco-lang/Language-suggestions/main/Resources/Logo-Short-Inverted-Outline.svg", "public/generated/Logo-Short-Inverted-Outline.png");
    await download("https://raw.githubusercontent.com/Draco-lang/Language-suggestions/main/Resources/Derpy-Outlined.svg", "public/generated/derpy.svg");
    emojis.push("derpy");
    let octokit;
    if (process.env.GITHUB_TOKEN !== undefined && process.env.GITHUB_TOKEN.length > 0) {
        const auth = createTokenAuth(process.env.GITHUB_TOKEN);
        const authentication = await auth();
        octokit = new Octokit({
            auth: authentication.token
        });
    } else {
        octokit = new Octokit();
    }

    const response = await octokit.repos.getContent({
        owner: "Draco-lang",
        repo: "Language-suggestions",
        path: "Resources/Emojis"
    });

    const promises = response.data.map(async element => {
        console.log(`Downloading ${element.name}...`);
        const resp = await fetch(element.download_url);
        const emoji = await resp.text();
        await fs.promises.writeFile(`public/generated/${element.name}`, emoji);
    });
    await Promise.all(promises);

    response.data
        .map(s => s.name.replace(/\.[^/.]+$/, ""))
        .forEach(s => emojis.push(s));
    await fs.promises.writeFile(
        "src/generated/emojiTypes.ts",
        `export type EmojiName = ${emojis.map(s => `"${s}"`).join(" | ")};`
    );
}
main();

async function download(url, path) {
    const resp = await fetch(url);
    const text = await resp.text();
    await fs.promises.writeFile(path, text);
}

async function downloadThemedImage(urls, outputPath, isUrl) {
    const svg = await createThemeBasedLogo(urls.light, urls.dark, isUrl);
    await fs.promises.writeFile(outputPath, svg);
    console.log(`Image downloaded and saved as ${outputPath}`);
}

function stripXMLHeader(xml) {
    const regex = /<\??xml[^>]*>/;
    return xml.replace(regex, "");
}

function stripViewBox(xml) {
    const regex = /viewBox="[^"]*"/;
    return xml.replace(regex, "");
}

function extractOpeningSvgTag(svgContent) {
    const openingSvgTagRegex = /<svg\b[^>]*>/;
    const openingSvgTagMatch = svgContent.match(openingSvgTagRegex);
    return openingSvgTagMatch ? openingSvgTagMatch[0] : "<svg xmlns=\"http://www.w3.org/2000/svg\">";
}

async function createThemeBasedLogo(lightUrl, darkUrl, isUrl) {
    let bodyLight, bodyDark;
    if (isUrl) {
        const responseLight = await fetch(lightUrl);
        const responseDark = await fetch(darkUrl);
        bodyLight = await responseLight.text();
        bodyDark = await responseDark.text();
    } else {
        bodyLight = await fs.promises.readFile(lightUrl, "utf-8");
        bodyDark = await fs.promises.readFile(darkUrl, "utf-8");
    }

    let logoLight = stripXMLHeader(bodyLight);
    logoLight = stripViewBox(logoLight);
    let logoDark = stripXMLHeader(bodyDark);
    logoDark = stripViewBox(logoDark);
    const openingSvgTag = extractOpeningSvgTag(bodyLight);
    const logoSvg =
        `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
            ${openingSvgTag}
            <style>
            @media (prefers-color-scheme: dark) {
                .light{
                    visibility: hidden;
                }
            }

            @media (prefers-color-scheme: light) {
                .dark{
                    visibility: hidden;
                }
            }
            </style>
            <g class="dark">
${logoDark}
            </g>
            <g class="light">
${logoLight}
            </g>
        </svg>
`;
    return logoSvg;
}

async function downloadAndConvertSvgToPng(url, outputPath) {
    const resp = await fetch(url);
    const svgContent = await resp.text();
    await sharp(Buffer.from(svgContent)).png().toFile(outputPath);
    console.log(`SVG converted and saved as ${outputPath}`);
}