import { Metadata } from "next";

export default function generateMetadata(
  title: string,
  description: string | undefined,
  imagePng: string,
  goBig: boolean
): Metadata {
  const urlBase = "https://draco-lang.org/";
  return {
    metadataBase: new URL(urlBase),
    title: title,
    description: description,
    icons: ["https://draco-lang.org/generated/Logo-Short.svg"],
    openGraph: {
      type: "website",
      title: title,
      description: description,
      images: [
        {
          url: imagePng,
          alt: "Draco Logo",
          type: "image/png",
        },
      ],
      url: urlBase,
      siteName: "draco-lang.org",
    },
    twitter: {
      title: title,
      description: description,
      images: {
        url: imagePng,
        alt: "Draco Logo",
        type: "image/png",
      },
      site: "@Draco_lang",
      card: goBig ? "summary_large_image" : "summary",
    },
  };
}