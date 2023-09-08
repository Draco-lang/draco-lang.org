import CodeTab from './CodeViewer/CodeTabs';
import CodeViewer from './CodeViewer/CodeViewer';
import './SecondSegment.css';
export default function SecondSegment() {
  const fizzbuzz =
`import System.Console;
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

  return (
    <div className="second-segment">
      <h1>Derpy™ Included.</h1>
      <CodeViewer className="splash-code-viewer">
        <CodeTab title="FizzBuzz" language="javascript">
          {fizzbuzz}
        </CodeTab>
        <CodeTab title="Python" language="python">
          {`greeting = "Hello, World!"\nprint(greeting)`}
        </CodeTab>
        {/* Add more CodeTab components as needed */}
      </CodeViewer>
    </div>
  );
}
