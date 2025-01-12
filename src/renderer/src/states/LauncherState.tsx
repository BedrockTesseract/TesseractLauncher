import { LauncherCore } from "@renderer/core/LauncherCore";
import LauncherSettings from "@renderer/core/LauncherSettings";
import { Task } from "@renderer/core/Task";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

export interface ILauncherState {
    keepLauncherOpen: boolean;
    setKeepLauncherOpen: (keepOpen: boolean) => void;
}

const LauncherStateContext = createContext<ILauncherState | undefined>(undefined);
export const LauncherStateProvider = ({children}: { children: ReactNode }) => {
    const [keepLauncherOpen, setKeepLauncherOpen] = useState<boolean>(false);
    useEffect(() => {
        const launcherSettings = LauncherCore.getSettings();
        setKeepLauncherOpen(launcherSettings.keep_open ?? true);
    }, []);

    const [initialized, setInitialized] = useState<boolean>(false);
    const saveSettings = useCallback(() => {
        const launcherSettings: LauncherSettings = {
            keep_open: keepLauncherOpen
        };

        LauncherCore.setSettings(launcherSettings);
    }, [keepLauncherOpen]);

    useEffect(() => {
        if (!initialized) {
            setInitialized(true);
            return;
        }

        saveSettings();
    }, [keepLauncherOpen]);

    return (
        <LauncherStateContext.Provider value={{
            keepLauncherOpen,
            setKeepLauncherOpen
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