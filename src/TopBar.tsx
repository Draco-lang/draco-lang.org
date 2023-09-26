import DracoButton from "./components/DracoButton";
import Link from "./components/Link";
import "./TopBar.css";

function TopBar() {
  return (
    <div className="top-bar">
      <Link href="/" className="top-bar-link">
        <img
          src="generated/Logo-Short.svg"
          className="top-bar-logo"
          alt="logo"
        />
      </Link>
      <div className="links">
        <DracoButton buttonSize="medium" href={"/docs"}>
          Documentation
        </DracoButton>{" "}
        {/*redirect to getting started for now*/}
        <DracoButton buttonSize="medium" href={"/specs"}>
          Specification
        </DracoButton>
        <DracoButton buttonSize="medium" href={"/community"}>
          Community
        </DracoButton>
        <DracoButton buttonSize="medium" href={"/blog"}>
          Blog
        </DracoButton>
        <a href="https://github.com/Draco-lang/">
          <img
            src="generated/github-logo.svg"
            className="topbar-icon"
            alt="GitHub Logo"
          />
        </a>
      </div>
    </div>
  );
}

export default TopBar;
