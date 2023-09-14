import DracoButton from './DracoButton';
import './TopBar.css';

function TopBar() {
    return (
        <div className="top-bar">
            <a href="/">
                <img src="generated/Logo-Short.svg" className="topbar-logo" alt="logo" />
            </a>
            <div className="links">

                <DracoButton buttonSize="medium" url={"#"}>Documentation</DracoButton> {/*redirect to getting started for now*/}
                <DracoButton buttonSize="medium" url={"#"}>Specifications</DracoButton>
                <DracoButton buttonSize="medium" url={"#"}>Community</DracoButton>
                <DracoButton buttonSize="medium" url={"#"}>Blog</DracoButton>

                <a href="https://github.com/Draco-lang/">
                    <img src="generated/github-logo.svg" className="topbar-icon" alt="GitHub Logo" />
                </a>
            </div>

        </div>
    );
}

export default TopBar;
