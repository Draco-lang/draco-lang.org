import "./Specification.css";
import Emoji from "./components/Emoji";

export default function Specification() {
  return (
    <div className="comming-soon">
      <h1>Coming Soon&ensp;</h1>{" "}
      <Emoji emojiName="hearteyes" emojiSize="100px" />
    </div>
  );
}