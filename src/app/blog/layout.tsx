import generateMetadata from "@/utils/metadata";
import { Metadata } from "next";

export const metadata: Metadata = generateMetadata({
  title: "The Draco Blog",
  description: "Development diary of the language and compiler.",
  imagePng: "https://draco-lang.org/generated/Logo-Short-Inverted-Outline.png",
  goBig: false,
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return <div className="page-blog">{children}</div>;
}
