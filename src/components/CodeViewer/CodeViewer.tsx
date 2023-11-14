import React, { ReactNode, HTMLProps } from "react";
import "./CodeViewer.css";
import Highlight from "./Highlight";

export default function CodeViewer(prop: HTMLProps<HTMLDivElement> & { children: ReactNode }): JSX.Element {
  const { children, ...restProps } = prop;
  const tabs = React.Children.toArray(children) as React.ReactElement[];

  return (
    <div {...restProps}>
      {tabs.map((tab, index) => (
        <div key={index}>
          <input
            type="radio"
            name="code-tabs"
            value={index}
            id={`check${index}`}
            key={index}
            defaultChecked={index === 0}
          />
          <div className="tab-content">
            <label
              className={`tab-buttons ${index === 0 ? "first-tab" : ""} ${index === tabs.length - 1 ? "last-tab" : ""}`}
              htmlFor={`check${index}`}
            >
              {tab.props.title}
            </label>
            <div className="code-container">
              <pre>
                <Highlight language={tab.props.language}>{tab.props.children}</Highlight>
              </pre>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
