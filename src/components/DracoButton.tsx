import { ReactNode } from "react";
import Link from "next/link";
import "./DracoButton.css";

export type ButtonSize = "small" | "medium" | "large";

export default function DracoButton(props: {
  buttonSize: ButtonSize;
  children: ReactNode;
  href: string;
  className?: string;
}) {
  const { buttonSize, children, className, href } = props;
  const buttonClassName = `draco-button ${ className || "" } draco-button-${buttonSize}`;

  return (
    <Link className={buttonClassName} href={href}>
      {children}
    </Link>
  );
}
