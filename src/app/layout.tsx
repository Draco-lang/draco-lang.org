import DracoButton from "@/components/DracoButton";
import Link from "next/link";
import Image from "next/image";
import "./layout.css";
import { Metadata } from "next";
import generateMetadata from "@/utils/metadata";

export const metadata: Metadata = generateMetadata({
  title: "Draco Programming Language",
  description: "A new .NET programming language in the making.",
  imagePng: "https://draco-lang.org/generated/Logo-Short-Inverted-Outline.png",
  goBig: false,
});

export interface Params {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Params) {
  return (
    <html>
      <body>
        <div className="app">
          <div className="top-bar">
            <div className="hamburger-wrapper">
              <div className="hamburger-icon">
                <div></div>
              </div>
              <div className="hamburger-close-icon">
                <div></div>
              </div>
              <Link href="/" className="top-bar-link">
                <Image
                  src="/generated/Logo-Short.svg"
                  className="top-bar-logo"
                  alt="logo"
                  height={50}
                  width={55}
                />
              </Link>
              <div className="links">
                <DracoButton buttonSize="medium" href={"/docs"} className="active-on-docs">
                  Documentation
                </DracoButton>
                {/*redirect to getting started for now*/}
                <DracoButton buttonSize="medium" href={"/specs"} className="active-on-specs">
                  Specification
                </DracoButton>
                <DracoButton
                  buttonSize="medium"
                  href={"/community"}
                  className="active-on-community"
                >
                  Community
                </DracoButton>
                <DracoButton buttonSize="medium" href={"/blog"} className="active-on-blog">
                  Blog
                </DracoButton>
              </div>
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
