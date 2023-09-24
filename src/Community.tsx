import "./Community.css";
import BackgroundLogo from "./components/BackgroundLogo";
import DiscordWidget from "./components/DiscordWidget";
import Emoji from "./components/Emoji";

export default function Community() {
    return (
        <div className="community">
            <h1>Community</h1>
            <div className="communityContent">
                <div>
                    <h2> Discord</h2>
                    <p>
                        <span>Draco Development, and general chatters happens on Discord.</span>
                        <span>Come talk to us!</span>
                        <span> And yes, we have Derpy emojis &nbsp; <Emoji className="inlineEmoji" emojiName="hearteyes" emojiSize="2.5em" /></span>
                    </p>
                    <DiscordWidget />
                    <BackgroundLogo logoUrl="discord-logo.svg" />
                </div>
                <div>
                    <h2>Twitch </h2>
                    <span>
                        We sometimes stream Draco development on our <a href="https://www.twitch.tv/dracolang">Twitch Channel</a>. Come watch us code, and ask us questions!
                    </span>
                    <BackgroundLogo logoUrl="twitch-logo.svg" style={{
                        marginBottom: "-35px",
                    }} sizeOverride="200px" />
                </div>
                <div>
                    <h2>Youtube</h2>
                    <span>Check out our <a href="https://www.youtube.com/@Draco-lang">YouTube channel</a>  for VODs of our Twitch streams.</span>
                    <BackgroundLogo logoUrl="youtube-logo.svg" />
                </div>
                <div>
                    <h2>GitHub</h2>
                    <p className="communityPadding">
                        <span>Draco is open source, and we welcome contributions!</span>
                        <span>Check out our GitHub organization to read the source code, or contribute to the Draco Compiler, this website, or our specs.</span>
                    </p>
                    <a href="https://github.com/Draco-lang/Compiler">
                        - The Compiler.
                    </a>
                    <a href="https://github.com/Draco-lang/Language-suggestions">
                        - The Specification
                    </a>
                    <a href="https://github.com/Draco-lang/draco-lang.github.io">
                        - This Website
                    </a>
                    <BackgroundLogo logoUrl="github-logo.svg" />
                </div>
            </div>
        </div>
    );
}
