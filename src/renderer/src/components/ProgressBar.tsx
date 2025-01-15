import './styles/ProgressBar.scss'
import { forwardRef, useImperativeHandle, useState } from 'react';

interface ProgressBarProps {
    value?: number,
    width?: string,
    height?: string,
    style?: React.CSSProperties,
    marquee?: boolean
}

export interface ProgressBarHandle {
    setIsMarquee: (isMarquee: boolean) => void;
    getIsMarquee: () => boolean;
}

const ProgressBar = forwardRef<ProgressBarHandle, ProgressBarProps>(({ value = 0, width, height, style, marquee }, ref) => {
    const [isMarquee, setIsMarquee] = useState(marquee ?? false);
    useImperativeHandle(ref, () => ({
        setIsMarquee,
        getIsMarquee: () => isMarquee
    }));
    return (
        <div className='progress-bar' style={{...style, width: width ?? '100%', height: height ?? '100%'}}>
            <div className='progress-bar-fill' style={{
                animation: isMarquee ? 'marquee 2s linear infinite' : 'initial',
                width: isMarquee ? '100%' : `${Math.floor(value * 100)}%`
            }}/>
        </div>
    )
});

export default ProgressBar;