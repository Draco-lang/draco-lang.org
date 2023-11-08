import generateMetadata from "@/utils/metadata";
import { Metadata } from "next";

export const metadata: Metadata = generateMetadata(
  "The Draco Blog",
  "",
  "http://factorio.kuinox.io/generated/Logo-Short-Inverted-Outline.png",
  true
);

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="page-blog">{children}</div>;
}
