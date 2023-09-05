import { ReactNode } from 'react';
import './DracoButton.css';

import { HTMLProps } from 'react';
type ButtonSize = "medium" | "large";
export default function DracoButton(props: HTMLProps<HTMLAnchorElement> & { buttonSize: ButtonSize; url: string; children: ReactNode }) {
    const {buttonSize, url, children, className,  ...restProps } = props;
    const buttonClassName = `draco-button ${className || ''} draco-button-${buttonSize}`;

    return (
        <a className={buttonClassName} href={url} {...restProps}>
            {children}
        </a>
    );
}
