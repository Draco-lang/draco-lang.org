"use client";

import { useEffect, useState } from "react";
import "./not-found.css";

export default function NotFound() {
  const [currRandom, setRandom] = useState(0);
  useEffect(() => {
    setRandom(Math.random());
  }, []);
  return (
    <div className="not-found">
      {currRandom > 0.5 ? (
        <img src="/generated/confused.svg" alt="Confused Derpy" />
      ) : (
        <img src="/generated/cry.svg" alt="Crying Derpy" />
      )}
      <h1>Page Not Found</h1>
    </div>
  );
}
