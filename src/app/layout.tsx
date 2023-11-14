import DracoButton from "@/components/DracoButton";
import Link from "next/link";
import Image from "next/image";
import "./layout.css";
import { Metadata } from "next";
import generateMetadata from "@/utils/metadata";
import { getSpecsInfo } from "@/utils/github";

export const metadata: Metadata = generateMetadata({
  title: "Draco Programming Language",
  description: "A new .NET programming language in the making.",
  imagePng: "https://draco-lang.org/generated/Logo-Short-Inverted-Outline.png",
  goBig: false,
});

export interface Params {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: Params) {
  // This is an hack to close the hamburger menu when the user clicks on a link.
  // Basically next.js prevent default behavior when clicking on a link
  // So we can't close it with pure html/css
  // So we add a lightweight script that close it when the user navigate to another page
  const scriptHTML = `
  <script>
  let checkbox = document.getElementById("top-bar-hamburger");
  let originalPushState = history.pushState;
  history.pushState = function(state, title, url) {
      originalPushState.apply(this, arguments);
      checkbox.checked = false;
  };
  </script>
  `;

  const specs = await getSpecsInfo();
  const introduction = specs.find((s) => s.name === "Introduction")!;
  specs.splice(specs.indexOf(introduction), 1);
  specs.unshift(introduction);

  return (
    <html>
      <body>
        <div className="app">
          <div className="top-bar">
            <div className="hamburger-wrapper">
              <input type="checkbox" id="top-bar-hamburger" className="hamburger-checkbox" />
              <label htmlFor="top-bar-hamburger" className="hamburger-icon">
                <div></div>
              </label>
              <Link href="/" className="top-bar-link close-hamberger-menu">
                <Image src="/generated/Logo-Short.svg" className="top-bar-logo" alt="logo" height={50} width={55} />
              </Link>
              <div className="links">
                <DracoButton buttonSize="medium" href="/docs" className="active-on-docs close-hamberger-menu">
                  Documentation
                </DracoButton>
                {/*redirect to getting started for now*/}
                <DracoButton buttonSize="medium" href="/specs" className="active-on-specs close-hamberger-menu">
                  Specification
                </DracoButton>
                <div className="specs-submenu">
                  {specs.map((spec) => (
                    <DracoButton
                      buttonSize="small"
                      href={`/specs/${spec.name}`}
                      className={`close-hamberger-menu article-active-on-${spec.name}`}
                      key={spec.name}
                    >
                      {spec.name}
                    </DracoButton>
                  ))}
                </div>
                <DracoButton buttonSize="medium" href="/community" className="active-on-community close-hamberger-menu">
                  Community
                </DracoButton>
                <DracoButton buttonSize="medium" href="/blog" className="active-on-blog close-hamberger-menu">
                  Blog
                </DracoButton>
              </div>
              <div dangerouslySetInnerHTML={{ __html: scriptHTML }}></div>
            </div>
            <a href="https://github.com/Draco-lang/">
              <Image
                src="/generated/github-logo.svg"
                className="topbar-github-icon"
                alt="GitHub Logo"
                height={28}
                width={28}
              />
            </a>
          </div>
          <div className="body">{children}</div>
        </div>
      </body>
    </html>
  );
}
