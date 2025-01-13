import { LauncherCore } from "@renderer/core/LauncherCore";
import LauncherSettings from "@renderer/core/LauncherSettings";
import { Task } from "@renderer/core/Task";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

export interface ILauncherState {
    keepLauncherOpen: boolean;
    setKeepLauncherOpen: (keepOpen: boolean) => void;
    showLauncherLogs: boolean;
    setShowLauncherLogs: (show: boolean) => void;
    showGameLogs: boolean;
    setShowGameLogs: (show: boolean) => void;
    getSettings: () => LauncherSettings;
}

const LauncherStateContext = createContext<ILauncherState | undefined>(undefined);
export const LauncherStateProvider = ({children}: { children: ReactNode }) => {
    const [keepLauncherOpen, setKeepLauncherOpen] = useState<boolean>(false);
    const [showLauncherLogs, setShowLauncherLogs] = useState<boolean>(false);
    const [showGameLogs, setShowGameLogs] = useState<boolean>(false);
    useEffect(() => {
        const launcherSettings = LauncherCore.getSettings();
        setKeepLauncherOpen(launcherSettings.keep_open ?? true);
        setShowLauncherLogs(launcherSettings.show_launcher_logs ?? true);
        setShowGameLogs(launcherSettings.show_game_logs ?? true);
    }, []);

    const getSettings = () => {
        return {
            keep_open: keepLauncherOpen,
            show_launcher_logs: showLauncherLogs,
            show_game_logs: showGameLogs,
        };
    };

    const [initialized, setInitialized] = useState<boolean>(false);
    const saveSettings = useCallback(() => {
        const launcherSettings: LauncherSettings = getSettings();
        LauncherCore.setSettings(launcherSettings);
    }, [keepLauncherOpen, showLauncherLogs, showGameLogs]);

    

    useEffect(() => {
        if (!initialized) {
            setInitialized(true);
            return;
        }

        saveSettings();
    }, [keepLauncherOpen, showLauncherLogs, showGameLogs]);

    return (
        <LauncherStateContext.Provider value={{
            keepLauncherOpen,
            setKeepLauncherOpen,
            showLauncherLogs,
            setShowLauncherLogs,
            showGameLogs,
            setShowGameLogs,
            getSettings
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