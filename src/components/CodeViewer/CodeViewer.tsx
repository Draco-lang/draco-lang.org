import React, { useState, ReactNode, HTMLProps } from "react";
import "./CodeViewer.css";
import "highlight.js/styles/atom-one-dark.css";
import Highlight from "react-highlight";


export default function CodeViewer(prop: HTMLProps<HTMLDivElement> & {children: ReactNode}): JSX.Element {
    const { children, ...restProps } = prop;
    
    const [activeTabIndex, setActiveTabIndex] = useState(0);

    const tabs = React.Children.toArray(children) as React.ReactElement[];

    const changeTab = (index: number) => {
        setActiveTabIndex(index);
    };

    return (
        <div {...restProps}>
            <div className="tab-buttons">
                {tabs.map((tab, index) => (
                    <button key={index} onClick={() => changeTab(index)} className={activeTabIndex === index ? "active" : ""}>
                        {tab.props.title}
                    </button>
                ))}
            </div>
            <div className="code-container">
                <pre>
                    <Highlight className={`language-${tabs[activeTabIndex].props.language}`}>
                        {tabs[activeTabIndex].props.children}
                    </Highlight>
                </pre>
            </div>
        </div>
    );
}