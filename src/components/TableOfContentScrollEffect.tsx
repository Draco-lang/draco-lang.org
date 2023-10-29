"use client";

import { useLayoutEffect } from "react";

export default function TableOfContentScrollEffect() {
  useLayoutEffect(() => {
    let lastClickTime = 0;
    function onLinkClick(event: Event) {
      const link = event.target as HTMLAnchorElement;
      const li = link.parentElement!.parentElement as HTMLLIElement;
      clearActiveTag();
      li.classList.add("active-poc-heading");
      lastClickTime = Date.now();
    }
    const tocLinks =  Array.from(document.getElementsByClassName("poc-heading"));
    tocLinks.forEach((e) => {
      e.addEventListener("click", onLinkClick);
    });

    const style = document.createElement("style");
    // We set this in js so noscript users can still see the table of content.
    style.innerHTML = `
    .poc-heading {
      max-height: 0;
    }
    `;
    document.head.appendChild(style);

    const headings = Array.from(
      document.getElementsByClassName("article-heading")
    );
    const headingsInScreen: {
      element: HTMLHeadingElement;
      isOnScreen: boolean;
    }[] = [];
    function callback(entries: IntersectionObserverEntry[]) {
      entries.forEach((entry) => {
        let curr = headingsInScreen.find((h) => h.element === entry.target);
        if (curr === undefined) {
          curr = {
            element: entry.target as HTMLHeadingElement,
            isOnScreen: false,
          };
          headingsInScreen.push(curr);
        }

        curr.isOnScreen = entry.isIntersecting;
      });

      // Prevent scroll event after clicking on heading to change the active heading.
      if(lastClickTime + 50 > Date.now()) {
        return;
      }

      clearActiveTag();
      let activeHeading: HTMLHeadingElement;
      const hasAnyOnScreen =
        headingsInScreen.findIndex((s) => s.isOnScreen) !== -1;
      if (!hasAnyOnScreen) {
        activeHeading = entries[0].target as HTMLHeadingElement;
      } else {
        let previous = headingsInScreen[0];
        for (let i = 0; i < headingsInScreen.length; i++) {
          const element = headingsInScreen[i];
          if (element.isOnScreen) break;

          previous = element;
        }
        activeHeading = previous.element;
      }

      const headingId = Array.from(activeHeading.classList)
        .find((c) => c.startsWith("heading-"))
        ?.replace("heading-", "");
      const pocHeading = document.getElementsByClassName(
        `poc-heading-${headingId}`
      )[0];
      if (pocHeading === undefined) {
        throw new Error(`poc-heading-${headingId} not found`);
      }

      pocHeading.classList.add("active-poc-heading");
    }
    const observer = new IntersectionObserver(callback, {
      root: document,
      rootMargin: "-150px 0px 0px 0px",
      threshold: 0,
    });
    headings.forEach((h) => observer.observe(h));
    return () => {
      observer.disconnect();
      tocLinks.forEach((e) => {
        e.removeEventListener("click", onLinkClick);
      });

    };
  });

  return <></>;
}
function clearActiveTag() {
  Array.from(document.getElementsByClassName("poc-heading")).forEach((e) =>
    e.classList.remove("active-poc-heading")
  );
}
