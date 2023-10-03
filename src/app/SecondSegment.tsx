import CodeTab from "../components/CodeViewer/CodeTab";
import CodeViewer from "../components/CodeViewer/CodeViewer";
import "./SecondSegment.css";
import SuperDerpy from "./SuperDerpy";

export default function SecondSegment() {
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

  return (
    <div className="second-segment">
      <h1 className="aligned">Derpy™ Included.</h1>
      <SuperDerpy />
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
