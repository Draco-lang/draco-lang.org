import { HTMLProps } from 'react';
import './Emoji.css';
import { EmojiName } from './generated/emojiTypes';
export default function Emoji(prop: HTMLProps<HTMLImageElement> & { emojiName: EmojiName }) {
    const { emojiName, alt, className, style, ...restProps } = prop;
    const imgClassName = `emoji ${className || ''}`;
    return (
        <span className={imgClassName} style={{...style, backgroundImage: `url(generated/${emojiName}.svg)`, backgroundSize:"1em", backgroundRepeat: 'no-repeat' }} {...restProps} />
    );
}


