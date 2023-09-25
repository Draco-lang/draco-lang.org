import React from "react";
import "./CodeTab.css";

export interface CodeTabProps {
  title: string;
  language: string;
  children: React.ReactNode;
}

export default function CodeTab({ children }: CodeTabProps): JSX.Element {
  return <>{children}</>;
}
