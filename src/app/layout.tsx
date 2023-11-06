import DracoButton from "@/components/DracoButton";
import Link from "next/link";
import Image from "next/image";
import "./layout.css";
import { Metadata } from "next";

const title = "Draco Programming Language";
const description = "A new .NET programming language in the making.";
const image = "/generated/Logo-Short.svg";
const urlBase = "https://draco-lang.org/";
export const metadata: Metadata = {
  metadataBase: new URL(urlBase),
  title: title,
  description: description,
  icons: [
    image
  ],
  openGraph: {
    type: "website",
    title: title,
    description: description,
    images: [
      image
    ],
    url: urlBase,
  },
  twitter: {
    title: title,
    description: description,
    images: image
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <html>
      <body>
        <div className="app">
          <div className="top-bar">
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
              <DracoButton
                buttonSize="medium"
                href={"/docs"}
                className="active-on-docs"
              >
                Documentation
              </DracoButton>
              {/*redirect to getting started for now*/}
              <DracoButton buttonSize="medium" href={"/specs"} className="active-on-specs">
                Specification
              </DracoButton>
              <DracoButton buttonSize="medium" href={"/community"} className="active-on-community">
                Community
              </DracoButton>
              <DracoButton buttonSize="medium" href={"/blog"} className="active-on-blog">
                Blog
              </DracoButton>
              <a href="https://github.com/Draco-lang/">
                <Image
                  src="/generated/github-logo.svg"
                  className="topbar-icon"
                  alt="GitHub Logo"
                  height={28}
                  width={28}
                />
              </a>
            </div>
          </div>
          <div className="body">{children}</div>
        </div>
      </body>
    </html>
  );
}
