import { ReactNode } from "react";
import Link from "next/link";
import "./DracoButton.css";

export type ButtonSize = "small" | "medium" | "large";

export default function DracoButton(props: {
  buttonSize: ButtonSize;
  children: ReactNode;
  href: string;
  className?: string;
  onClick?: () => void;
}) {
  const { buttonSize, children, className, href, onClick } = props;
  const buttonClassName = `draco-button ${
    className || ""
  } draco-button-${buttonSize}`;

  return (
    <Link className={buttonClassName} href={href} onClick={onClick}>
      {children}
    </Link>
  );
}
