import DracoButton from "../components/DracoButton";
import "./LandingSegment.css";

export default function LandingSegment() {
  return (
    <div className="landing-segment">
      <img
        src="/generated/Logo-Long.svg"
        className="splash-logo"
        alt="Big Logo of Draco"
        height={300}
        style={{
          maxWidth: "90%",
        }}
      />
      <h1>A new .NET programming language in the making.</h1>
      <div className="main-buttons">
        <DracoButton buttonSize="large" className="getstarted" href="docs">
          Getting Started
        </DracoButton>
        <DracoButton buttonSize="large" className="specs" href="specs">
          Specification
        </DracoButton>
      </div>
    </div>
  );
}
