import { ReactNode } from "react";
import { HTMLProps } from "react";
import "./DracoButton.css";
import Link from "./Link";

type ButtonSize = "medium" | "large";
export default function DracoButton(props: HTMLProps<HTMLAnchorElement> & { buttonSize: ButtonSize; children: ReactNode }) {
    const {buttonSize, children, className,  ...restProps } = props;
    const buttonClassName = `draco-button ${className || ""} draco-button-${buttonSize}`;
   
    return (
        <Link className={buttonClassName} {...restProps}>
            {children}
        </Link>
    );
}
