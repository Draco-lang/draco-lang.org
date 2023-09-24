import { useEffect, useState } from "react";
import "./Body.css";
import LandingPage from "./LandingPage/LandingPage";
import NotFound from "./NotFound";
import Documentation from "./Documentation";
import Specification from "./Specification";
import Blog from "./Blog";
import Community from "./Community";

export default function Body() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const onLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("navigate", onLocationChange);
  }, []);

  console.log(currentPath);
  if(currentPath === "/") {
    return (
      <div className="body">
        <LandingPage />
      </div>
    );
  }
  if(currentPath.startsWith("/docs")) {
    return (
      <div className="body">
        <Documentation />
      </div>
    );
  }

  if(currentPath.startsWith("/specs")) {
    return (
      <div className="body">
        <Specification />
      </div>
    );
  }

  if(currentPath.startsWith("/community")) {
    return (
      <div className="body">
        <Community />
      </div>
    );
  }

  if(currentPath.startsWith("/blog")) {
    return (
      <div className="body">
        <Blog />
      </div>
    );
  }

  return (
      <div className="body">
        <NotFound />
      </div>
  );
}
