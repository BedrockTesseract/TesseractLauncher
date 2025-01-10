import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

interface ILauncherState {

}

const LauncherStateContext = createContext<ILauncherState | undefined>(undefined);
export const LauncherStateProvider = ({children}: { children: ReactNode }) => {
    useEffect(() => {

    }, []);

    const [initialized, setInitialized] = useState<boolean>(false);
    const saveSettings = useCallback(() => {

    }, []);

    return (
        <LauncherStateContext.Provider value={{

        }}>
            {children}
        </LauncherStateContext.Provider>
    )
}

export function useLauncherState() {
    const context = useContext(LauncherStateContext);
    if (!context) {
        throw new Error("useLauncherState must be used within a LauncherStateProvider");
    }
    return context;
}