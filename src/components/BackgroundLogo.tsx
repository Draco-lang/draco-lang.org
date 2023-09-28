import React from "react";
import "./BackgroundLogo.css";
import Image from "next/image";

export default function BackgroundLogo(
  props: {
    logoUrl: string;
    sizeOverride?: number;
  } & React.HTMLAttributes<HTMLDivElement>
) {
  const { logoUrl, sizeOverride, ...restProps } = props;
  return (
    <div {...restProps} className="background-logo-container">
      <Image
        className="background-logo"
        src={logoUrl}
        alt="Background decoration."
        height={sizeOverride ?? 0}
        width={0}
      />
    </div>
  );
}
