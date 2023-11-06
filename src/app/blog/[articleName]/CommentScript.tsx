"use client";
import { useEffect, useRef } from "react";

export default function CommentScript() {
  const commentBox = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scriptEl = document.createElement("script");
    scriptEl.src = "https://giscus.app/client.js";
    scriptEl.setAttribute("data-repo", "Kuinox/draco-lang.github.io");
    scriptEl.setAttribute("data-repo-id", "R_kgDOKNtvDA");
    scriptEl.setAttribute("data-category", "Blog Comments");
    scriptEl.setAttribute("data-category-id", "DIC_kwDOKNtvDM4CarR0");
    scriptEl.setAttribute("data-mapping", "url");
    scriptEl.setAttribute("data-strict", "1");
    scriptEl.setAttribute("data-reactions-enabled", "1");
    scriptEl.setAttribute("data-emit-metadata", "0");
    scriptEl.setAttribute("data-input-position", "top");
    scriptEl.setAttribute("data-theme", "dark_dimmed");
    scriptEl.setAttribute("data-lang", "en");
    scriptEl.setAttribute("crossorigin", "anonymous");
    scriptEl.async = true;

    const current = commentBox.current!;
    current.appendChild(scriptEl);

    return () => {
      current.innerHTML = "";
    };
  }, []);

  return <div ref={commentBox}></div>;
}
