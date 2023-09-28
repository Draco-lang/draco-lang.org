"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import "./not-found.css";

export default function NotFound() {
  const [currRandom, setRandom] = useState(0);
  useEffect(() => {
    setRandom(Math.random());
  }, []);
  return (
    <div className="not-found">
      {currRandom > 0.5 ? (
        <Image src="generated/confused.svg" alt="Confused Derpy" fill={true} />
      ) : (
        <Image src="generated/cry.svg" alt="Crying Derpy" fill={true}/>
      )}
      <h1>Page Not Found</h1>
    </div>
  );
}
