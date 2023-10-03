import DracoButton from "@/components/DracoButton";
import Link from "next/link";
import Image from "next/image";
import "./layout.css";

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
                src="generated/Logo-Short.svg"
                className="top-bar-logo"
                alt="logo"
                height={50}
                width={55}
              />
            </Link>
            <div className="links">
              <DracoButton buttonSize="medium" href={"/docs"}>
                Documentation
              </DracoButton>{" "}
              {/*redirect to getting started for now*/}
              <DracoButton buttonSize="medium" href={"/specs"}>
                Specification
              </DracoButton>
              <DracoButton buttonSize="medium" href={"/community"}>
                Community
              </DracoButton>
              <DracoButton buttonSize="medium" href={"/blog"}>
                Blog
              </DracoButton>
              <a href="https://github.com/Draco-lang/">
                <Image
                  src="generated/github-logo.svg"
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