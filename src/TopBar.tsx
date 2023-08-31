import './TopBar.css';

function TopBar() {
    return (
        <div className="top-bar">
            <a href="/">
                <img src="Logo-Short.svg" className="topbar-logo" alt="logo" />
            </a>
            <a href="https://github.com/Draco-lang/">
                <img src="github-logo.svg" className="topbar-icon" alt="GitHub Logo" />
            </a>
        </div>
    );
}

export default TopBar;
