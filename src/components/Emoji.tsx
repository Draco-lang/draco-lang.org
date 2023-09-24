import { HTMLProps } from "react";
import { EmojiName } from "../generated/emojiTypes";
export default function Emoji(prop: HTMLProps<HTMLImageElement> & { emojiName: EmojiName, emojiSize?: string }) {
    const { emojiName, alt, className, style, emojiSize, ...restProps } = prop;
    const imgClassName = `emoji ${className || ""}`;
    return (
        <img src={`generated/${emojiName}.svg`} className={imgClassName} {...restProps} alt={`Emoji ${emojiName}`}
            style={{
                ...style,
                height: emojiSize ?? "1em",
                width: emojiSize ?? "1em"
            }}
        />
    );
}
