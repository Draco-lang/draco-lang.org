import React from "react";
import "./BackgroundLogo.css";

export default function BackgroundLogo(
  props: {
    logoUrl: string;
    sizeOverride?: string;
  } & React.HTMLAttributes<HTMLDivElement>
) {
  const { logoUrl, sizeOverride, ...restProps } = props;
  return (
    <div {...restProps} className="background-logo-container">
      <img
        className="background-logo"
        src={logoUrl}
        alt="Background decoration."
        style={{
          height: sizeOverride,
        }}
      />
    </div>
  );
}
