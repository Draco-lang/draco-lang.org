import generateMetadata from "@/utils/metadata";
import { Metadata } from "next";

export const metadata: Metadata = generateMetadata(
  "The Draco Blog",
  "",
  "http://blog.kuinox.io/generated/Logo-Short.svg",
  "http://factorio.kuinox.io/generated/Logo-Short-Inverted-Outline.png"
);

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="page-blog">{children}</div>;
}
