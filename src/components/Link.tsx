import React from "react";
import { HTMLProps, ReactNode } from "react";

export default function Link(
  props: HTMLProps<HTMLAnchorElement> & { children: ReactNode }
) {
  const { href, children, ...restProps } = props;
  const preventReload = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault();
    window.history.pushState({}, "", href);
    const navigationEvent = new PopStateEvent("navigate");
    window.dispatchEvent(navigationEvent);
  };
  return (
    <a href={href} onClick={preventReload} {...restProps}>
      {children}
    </a>
  );
}
