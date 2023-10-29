import { Lexer, marked } from "marked";
import hljs from "highlight.js";
import "./Article.css";
import { HTMLProps } from "react";
import TableOfContentScrollEffect from "./TableOfContentScrollEffect";
import "highlight.js/styles/atom-one-dark.css";

export default async function Article(
  params: HTMLProps<HTMLDivElement> & { markdown: string }
) {
  const { markdown, className, ...restProps } = params;
  const headingsMapPoc = {};
  const headingsMapArticle = {};
  const html = marked(markdown, {
    gfm: true,
    async: false,
    renderer: myRenderer(),
  });
  const tokens = Lexer.lex(markdown, {
    gfm: true,
  });
  const headings = tokens.filter((t) => t.type === "heading" && t.depth > 1);

  function renderHeading(nodes: Node[]) {
    return (
      <ul>
        {nodes.map((node) => {
          const cleanedTitle = marked(node.title).replace(/^<h[0-9]>/, "").replace(/<\/h[0-9]>\n$/, "");
          const id = getHeading(
            cleanedTitle,
            headingsMapPoc
          );
          return (
            <li
              key={node.title.replace(/^#+/, "").trim()}
              className={`poc-heading poc-heading-${id}`}
            >
              <a href={`#${id}`} className="not-a-link">
                <span className="toc-bar"></span>{" "}
                <span>{node.title.replace(/^#+/, "").trim()}</span>
              </a>
              {node.children.length > 0 && renderHeading(node.children)}
            </li>
          );
        })}
      </ul>
    );
  }

  function myRenderer() {
    const renderer = new marked.Renderer();
    renderer.code = (code, language) => {
      let highlighted = code;
      if (language !== undefined && language.length > 0) {
        try {
          highlighted = hljs.highlight(code, { language: language }).value;
        } catch (e) {
          console.error(e);
          highlighted = hljs.highlightAuto(code).value;
        }
      }

      const base64Code = stringToBase64(code);
      return `
      <div class="code-box">
        <div class="code-title-bar">
            <div>
              <span class="code-icon">&#60;/&#62;</span>
              <span>${language}</span>
            </div>
            <span class="clipboard-icon" onclick="navigator.clipboard.writeText(decodeURIComponent(escape(atob('${base64Code}')))); this.classList.add('copy-ok'); setTimeout(() => this.classList.remove('copy-ok'), 2000);"/>
        </div>
        <pre><code class="language-${language}">${highlighted}</code></pre>
      </div>
      `;
    };
    renderer.heading = (text, level) => {
      if (level === 1) return `<h1>${text}</h1>`;

      const hashName = getHeading(text, headingsMapArticle);
      const str = `<a href="#${hashName}" class="not-a-link"> <h${level} id="${hashName}" class="article-heading heading-${hashName}">${text}</h${level}> </a>`;
      return str;
    };
    return renderer;
  }

  function getHeading(text: string, map: { [key: string]: number }): string {
    const hash = createHashLink(text);
    if (map[hash] === undefined) {
      map[hash] = 0;
    } else {
      map[hash]++;
    }

    const i = map[hash];
    return `${hash}${i === 0 ? "" : `-${i}`}`;
  }

  function createHashLink(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-");
  }

  return (
    <div className={`article ${className ?? ""}`} {...restProps}>
      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: html }}
      ></div>
      <div className="table-of-content">
        <h1>Contents</h1>
        {renderHeading(headingsToTree(headings.map((h) => h.raw)))}
      </div>
      {<TableOfContentScrollEffect />}
    </div>
  );
}

type Node = {
  children: Node[];
  title: string;
  parent?: Node;
};

function headingsToTree(headings: string[]): Node[] {
  const root: Node = {
    children: [],
    title: "",
  };

  let current = root;
  let currentDepth = 1;

  for (const heading of headings) {
    const depth = headingDepth(heading);
    if (depth > currentDepth) {
      const last = current.children.at(-1)!;
      const newChild = {
        children: [],
        title: heading,
        parent: last,
      };
      last.children.push(newChild);
      current = last;
      currentDepth = currentDepth + 1; // we don't use depth because it might skip levels
    } else if (depth < currentDepth) {
      for (let i = 0; i < currentDepth - depth; i++) {
        current = current.parent!;
      }
      currentDepth = depth;
      current.children.push({
        title: heading,
        children: [],
        parent: current,
      });
    } else {
      current.children.push({
        title: heading,
        children: [],
        parent: current,
      });
    }
  }

  return root.children;
}

function headingDepth(heading: string): number {
  const match = heading.match(/^#+/);
  if (!match) {
    throw new Error(`Invalid heading: ${heading}`);
  }

  return match[0].length - 1;
}

function stringToBase64(input: string) {
  return btoa(unescape(encodeURIComponent(input)));
}
