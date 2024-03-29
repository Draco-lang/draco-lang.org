"use client";
import { useEffect, useRef, useState } from "react";

export default function CommentScript() {
  // this is an "hack" because react doesn't like custom attribute in script tag.
  // So we gotta build the script tag manually.
  const commentBox = useRef<HTMLDivElement | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const matcher = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = ({ matches }: { matches: boolean }) => setIsDarkMode(matches);
    matcher.addEventListener("change", onChange);

    const isDarkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = isDarkMode ? "dark_dimmed" : "light";
    const scriptEl = document.createElement("script");
    scriptEl.src = "https://giscus.app/client.js";
    scriptEl.setAttribute("data-repo", "Draco-lang/draco-lang.org");
    scriptEl.setAttribute("data-repo-id", "R_kgDOJbD9Tg");
    scriptEl.setAttribute("data-category", "Blog Comments");
    scriptEl.setAttribute("data-category-id", "DIC_kwDOJbD9Ts4Ca3WA");
    scriptEl.setAttribute("data-mapping", "url");
    scriptEl.setAttribute("data-strict", "1");
    scriptEl.setAttribute("data-reactions-enabled", "1");
    scriptEl.setAttribute("data-emit-metadata", "0");
    scriptEl.setAttribute("data-input-position", "top");
    scriptEl.setAttribute("data-theme", theme);
    scriptEl.setAttribute("data-lang", "en");
    scriptEl.setAttribute("crossorigin", "anonymous");
    scriptEl.async = true;

    const current = commentBox.current!;
    current.appendChild(scriptEl);

    return () => {
      current.innerHTML = "";
      matcher.removeEventListener("change", onChange);
    };
  }, [isDarkMode]);

  return <div ref={commentBox}></div>;
}
