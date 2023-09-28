"use client";

import { useState } from "react";
import CodeTab from "../components/CodeViewer/CodeTab";
import CodeViewer from "../components/CodeViewer/CodeViewer";
import Emoji from "../components/Emoji";
import { EmojiName } from "../generated/emojiTypes";
import "./SecondSegment.css";

export default function SecondSegment() {
  const [emojiState, setEmoji] = useState<{ name: EmojiName; title: string }>({
    name: "smile",
    title: "Derpy is our mascot.",
  });
  const [clickCount, setClickCount] = useState(0);
  const fizzbuzz = `import System.Console;
import System.Linq.Enumerable;

func main() {
    for (i in Range(100)) {
        match (i mod 3, i mod 5) {
            (0, 0) -> WriteLine("FizzBuzz");
            (0, _) -> WriteLine("Fizz");
            (_, 0) -> WriteLine("Buzz");
            _ -> WriteLine(i);
        }
    }
}`;
  const guessANumber = `import System;
import System.Console;

func main() {
    val value = Random.Shared.Next(1, 101);
    while (true) {
        Write("Guess a number (1-100): ");
        val input = Convert.ToInt32(ReadLine());
        if (input == value) goto break;
        WriteLine("Incorrect. Too \\{if (input < value) "low" else "high"}");
    }
    WriteLine("You guessed it!");
}`;

  const handleEmojiClick = () => {
    if (clickCount >= 0 && clickCount <= 5) {
      setClickCount(clickCount + 1);
    }

    switch (clickCount + 1) {
      case 1:
        setEmoji({
          name: "sad",
          title: "Derpy is sad. He dislke to be clicked.",
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
    console.log(emojiState);
    setTimeout(() => {
      setEmoji({ name: "smile", title: "Derpy calmed down." });
    }, 3000);
  };
  return (
    <div className="second-segment">
      <h1 className="aligned">Derpy™ Included.</h1>
      <Emoji
        className="super-derpy"
        emojiName={emojiState.name}
        onClick={handleEmojiClick}
        style={{ cursor: emojiState.name === "smile" ? "pointer" : "default" }}
        title={emojiState.title}
      />
      <CodeViewer className="splash-code-viewer">
        <CodeTab title="FizzBuzz" language="kotlin">
          {fizzbuzz}
        </CodeTab>
        <CodeTab title="Guess A Number" language="kotlin">
          {guessANumber}
        </CodeTab>
      </CodeViewer>
    </div>
  );
}
