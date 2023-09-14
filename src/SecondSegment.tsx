import { useState } from 'react';
import CodeTab from './CodeViewer/CodeTabs';
import CodeViewer from './CodeViewer/CodeViewer';
import Emoji from './Emoji';
import './SecondSegment.css';
import { EmojiName } from './generated/emojiTypes';

export default function SecondSegment() {
  const [emoji, setEmoji] = useState<EmojiName>('smile');
  const [clickCount, setClickCount] = useState(0);
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

  const handleEmojiClick = () => {
    if (clickCount >= 0 && clickCount <= 5) {
      setClickCount(clickCount + 1);
    }
    switch (clickCount+1) {
      case 1:
        setEmoji('sad');
        break;
      case 2:
        setEmoji('cry');
        break;
      case 3:
        setEmoji('angry');
        break;
      case 4:
        setEmoji('ree');
        break;
      case 5:
        setEmoji('triggered');
        break;
      default:
        setEmoji('triggered');
        break;
    }
    console.log(emoji);
    setTimeout(() => {
      setEmoji('smile');
    }, 1000);

  };
  return (
    <div className="second-segment">
      <h1 className='aligned'>Derpy™ Included.</h1>
      <Emoji className='superDerpy' emojiName={emoji} onClick={handleEmojiClick} style={{ cursor: (emoji === 'smile' ? 'pointer' : 'default') }} />
      <CodeViewer className="splash-code-viewer">
        <CodeTab title="FizzBuzz" language="javascript">
          {fizzbuzz}
        </CodeTab>
        <CodeTab title="Python" language="python">
          {`greeting = "Hello, World!"\nprint(greeting)`}
        </CodeTab>
      </CodeViewer>
    </div>
  );
}
