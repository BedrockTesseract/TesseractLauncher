import { forwardRef, useImperativeHandle, useState } from "react";
import "./ProgressBar.css"

interface ProgressBarProps {
    startValue?: number,
    width?: string,
    height?: string,
    style?: React.CSSProperties,
    marquee?: boolean
}

export interface ProgressBarHandle {
    setValue: (value: number) => void;
    getValue: () => number;
    setIsMarquee: (isMarquee: boolean) => void;
    getIsMarquee: () => boolean;
}

const ProgressBar = forwardRef<ProgressBarHandle, ProgressBarProps>(({ startValue, width, height, style, marquee }, ref) => {
    const [value, setValue] = useState(startValue ?? 0);
    const [isMarquee, setIsMarquee] = useState(marquee ?? false);
    useImperativeHandle(ref, () => ({
        setValue,
        getValue: () => value,
        setIsMarquee,
        getIsMarquee: () => isMarquee
    }));
    return (
        <div className="progress-bar" style={{...style, width: width ?? "100%", height: height ?? "100%"}}>
            <div className="progress-bar-fill" style={{
                animation: isMarquee ? "marquee 2s linear infinite" : "unset",
                width: isMarquee ? "100%" : `${Math.floor(value * 100)}%`
            }}/>
        </div>
    )
});

export default ProgressBar;