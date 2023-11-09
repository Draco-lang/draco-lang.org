import { Metadata } from "next";

export interface MetadataInput {
  title: string;
  description: string | undefined;
  imagePng: string;
  goBig: boolean;
}

export default function generateMetadata( metadata: MetadataInput): Metadata {
  const { title, description, imagePng, goBig } = metadata;
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