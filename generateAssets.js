const { Octokit } = require('@octokit/rest');
const fs = require('fs/promises');
const createActionAuth = require('@octokit/auth-action');

const fullLogoLight = 'https://raw.githubusercontent.com/Draco-lang/Language-suggestions/main/Resources/Logo-Long.svg';
const fullLogoDark = 'https://raw.githubusercontent.com/Draco-lang/Language-suggestions/main/Resources/Logo-Long-Inverted.svg';
const shortLogoUrlLight = 'https://raw.githubusercontent.com/Draco-lang/Language-suggestions/main/Resources/Logo-Short.svg';
const shortLogoUrlDark = 'https://raw.githubusercontent.com/Draco-lang/Language-suggestions/main/Resources/Logo-Short-Inverted.svg';
const githubLogoDark = 'prebuild_assets/github-mark-white.svg';
const githubLogoLight = 'prebuild_assets/github-mark.svg';
const emojis = [];
async function main() {
    downloadThemedImage(fullLogoLight, fullLogoDark, 'public/generated/Logo-Long.svg', true);
    downloadThemedImage(shortLogoUrlLight, shortLogoUrlDark, 'public/generated/Logo-Short.svg', true);
    downloadThemedImage(githubLogoLight, githubLogoDark, 'public/generated/github-logo.svg', false);
    download('https://raw.githubusercontent.com/Draco-lang/Language-suggestions/main/Resources/Derpy-Outlined.svg', 'public/generated/derpy.svg');
    emojis.push('derpy');
    let octokit;
    if (process.env.GITHUB_TOKEN !== undefined && process.env.GITHUB_TOKEN.length > 0) {
        const auth = createActionAuth();
        const authentication = await auth();
        octokit = new Octokit({
            auth: authentication.token
        });
    } else {
        octokit = new Octokit();
    }

    const response = await octokit.repos.getContent({
        owner: 'Draco-lang',
        repo: 'Language-suggestions',
        path: 'Resources/Emojis'
    });
    
    for (let i = 0; i < response.data.length; i++) {
        const element = response.data[i];
        console.log(`Downloading ${element.name}...`);
        const resp = await fetch(element.download_url);
        const emoji = await resp.text();
        await fs.writeFile(`public/generated/${element.name}`, emoji);
    }
    response.data
        .map(s=>`${s.name.replace(/\.[^/.]+$/, "")}`)
        .forEach(
            s=> emojis.push(s)
        );
    await fs.writeFile(
        'src/generated/emojiTypes.ts',
        `export type EmojiName = ${emojis.map(s=>`"${s}"`).join(' | ')};`
    );
}
main();

async function download(url, path) {
    const resp = await fetch(url);
    const emoji = await resp.text();
    await fs.writeFile(path, emoji);
    
}

async function downloadThemedImage(lightImageUrl, darkImageUrl, outputPath, isUrl) {
    const svg = await createThemeBasedLogo(lightImageUrl, darkImageUrl, isUrl);
    await fs.writeFile(outputPath, svg);
    console.log(`Image downloaded and saved as ${outputPath}`);
}


function stripXMLHeader(xml) {
    const regex = /<\??xml[^>]*>/;
    return xml.replace(regex, '');
}

function stripViewBox(xml) {
    const regex = /viewBox="[^"]*"/;
    return xml.replace(regex, '');
}

function extractOpeningSvgTag(svgContent) {
    const openingSvgTagRegex = /<svg\b[^>]*>/;
    const openingSvgTagMatch = svgContent.match(openingSvgTagRegex);
    return openingSvgTagMatch ? openingSvgTagMatch[0] : '<svg xmlns="http://www.w3.org/2000/svg">';
}

async function createThemeBasedLogo(lightUrl, darkUrl, isUrl) {
    let bodyLight, bodyDark;
    if (isUrl) {
        const responseLight = await fetch(lightUrl);
        const responseDark = await fetch(darkUrl);
        bodyLight = await responseLight.text();
        bodyDark = await responseDark.text();
    } else {
        bodyLight = await fs.readFile(lightUrl, 'utf-8');
        bodyDark = await fs.readFile(darkUrl, 'utf-8');
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