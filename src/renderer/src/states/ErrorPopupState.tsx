import Text from '@renderer/components/Text';
import { Logger } from '@renderer/utils/Logger';
import { ReactNode, useContext, useState, createContext } from 'react';

export interface IErrorPopupState {
    setAnimation: (animation: string) => void;
    getAnimation: () => string;
    setVisible: (visible: boolean) => void;
    getVisible: () => boolean;
    setCurrentElement: (element: ReactNode) => void;
    getCurrentElement: () => ReactNode | null;
    show: (animate: boolean, hideTimeout: number) => void;
    hide: (animate: boolean) => void;
    triggerError: (message: string, hideTimeout: number) => void;
}

const ErrorPopupStateContext = createContext<IErrorPopupState | undefined>(undefined);
export const ErrorPopupStateProvider = ({children}: { children: ReactNode }) => {    
    const [visible, setVisible] = useState(false);
    const [animation, setAnimation] = useState('popIn 0.4s backwards');
    const [currentElement, setCurrentElement] = useState<ReactNode | null>(null);

    const show = async (animate: boolean = true, hideTimeout: number = -1) => {
        if (animate) {
            setAnimation('popIn 0.4s forwards');
            await new Promise(resolve => setTimeout(resolve, 400));
        } else {
            setAnimation('none');
        }
        setVisible(true);
        if (hideTimeout > 0) {
            setTimeout(() => hide(true), hideTimeout);
        }
    };

    const hide = async (animate: boolean = true) => {
        if (animate) {
            setAnimation('popOut 0.4s forwards');
            await new Promise(resolve => setTimeout(resolve, 400));
        } else {
            setAnimation('none');
        }
        setVisible(false);
    };

    const triggerError = (message: string, hideTimeout: number = -1) => {
        let date = new Date(Date.now());
        let hours = String(date.getHours()).padStart(2, '0');
        let minutes = String(date.getMinutes()).padStart(2, '0');
        let seconds = String(date.getSeconds()).padStart(2, '0');
        let formattedTime = `${hours}:${minutes}:${seconds}`;
        var separateLines = message.split(/\r?\n|\r|\n/g);
        setCurrentElement(separateLines.map((line, index) => {return <Text>{`[${formattedTime}] [Launcher/error] ${line}`}</Text>}));
        Logger.error(message);
        show(true, hideTimeout);
    }

    return (
        <ErrorPopupStateContext.Provider value={{
            setAnimation,
            getAnimation: () => animation,
            setVisible,
            getVisible: () => visible,
            setCurrentElement,
            getCurrentElement: () => currentElement,
            show,
            hide,
            triggerError
        }}>
            {children}
        </ErrorPopupStateContext.Provider>
    )
}

export function useErrorPopupState() {
    const context = useContext(ErrorPopupStateContext);
    if (!context) {
        throw new Error('useErrorPopupState must be used within a ErrorPopupStateProvider');
    }
    return context;
}