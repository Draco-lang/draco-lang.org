"use client";

import { useState } from "react";
import { EmojiName } from "../generated/emojiTypes";
import Emoji from "@/components/Emoji";

export default function SuperDerpy() {
  const [emojiState, setEmoji] = useState<{ name: EmojiName; title: string }>({
    name: "smile",
    title: "Derpy is our mascot.",
  });
  const [clickCount, setClickCount] = useState(0);
  const handleEmojiClick = () => {
    if (clickCount >= 0 && clickCount <= 5) {
      setClickCount(clickCount + 1);
    }

    switch (clickCount + 1) {
      case 1:
        setEmoji({
          name: "sad",
          title: "Derpy is sad. He dislikes to be clicked.",
        });
        break;
      case 2:
        setEmoji({
          name: "cry",
          title: "Derpy is crying. Why are you mean with him?",
        });
        break;
      case 3:
        setEmoji({ name: "angry", title: "Derpy is angry. He may bite you." });
        break;
      case 4:
        setEmoji({ name: "ree", title: "Derpy is very angry." });
        break;
      default:
        setEmoji({
          name: "triggered",
          title: "You have unleashed the fury of the Derpy.",
        });
        break;
    }
    setTimeout(() => {
      setEmoji({ name: "smile", title: "Derpy calmed down." });
    }, 3000);
  };

  return (
    <Emoji
      className="super-derpy"
      emojiName={emojiState.name}
      onClick={handleEmojiClick}
      style={{ cursor: emojiState.name === "smile" ? "pointer" : "default" }}
      title={emojiState.title}
    />
  );
}
