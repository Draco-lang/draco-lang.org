import { Metadata } from "next";

export default function generateMetadata(
  title: string,
  description: string | undefined,
  image: string,
  imagePng: string
): Metadata {
  const urlBase = "https://draco-lang.org/";
  return {
    metadataBase: new URL(urlBase),
    title: title,
    description: description,
    icons: [image],
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
      card: "summary",
    },
  };
}