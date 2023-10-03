import hljs from "highlight.js";
import { HTMLProps } from "react";
import "./Highlight.css";

export default function Highlight(
  prop: HTMLProps<HTMLDivElement> & { language: string; children: string }
) {
  const { children, language, ...restProps } = prop;
  const highlighted = hljs.highlight(children, {
    language: language,
    ignoreIllegals: true
  });
  return (
    <code
      className={`language-${language} code-viewer`}
      {...restProps}
      dangerouslySetInnerHTML={{ __html: highlighted.value }} // This come from highlight.js. It should be safe to use. The code is not user generated.
    ></code>
  );
}
