const fs = require('fs/promises');

const fullLogoLight = 'https://raw.githubusercontent.com/Draco-lang/Language-suggestions/main/Resources/Logo-Long.svg';
const fullLogoDark = 'https://raw.githubusercontent.com/Draco-lang/Language-suggestions/main/Resources/Logo-Long-Inverted.svg';
const shortLogoUrlLight = 'https://raw.githubusercontent.com/Draco-lang/Language-suggestions/main/Resources/Logo-Short.svg';
const shortLogoUrlDark = 'https://raw.githubusercontent.com/Draco-lang/Language-suggestions/main/Resources/Logo-Short-Inverted.svg';
const githubLogoDark = 'prebuild_assets/github-mark-white.svg';
const githubLogoLight = 'prebuild_assets/github-mark.svg';

async function main() {
    downloadImage(fullLogoLight, fullLogoDark, 'public/Logo-Long.svg', true);
    downloadImage(shortLogoUrlLight, shortLogoUrlDark, 'public/Logo-Short.svg', true);
    downloadImage(githubLogoLight, githubLogoDark, 'public/github-logo.svg', false);
}
main();


async function downloadImage(lightImageUrl, darkImageUrl, outputPath, isUrl) {
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