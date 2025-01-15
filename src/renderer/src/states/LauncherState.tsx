import { LauncherCore } from '@renderer/core/LauncherCore';
import LauncherSettings from '@renderer/core/LauncherSettings';
import { Task } from '@renderer/core/Task';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

export interface ILauncherState {
    keepLauncherOpen: boolean;
    setKeepLauncherOpen: (keepOpen: boolean) => void;
    showLauncherLogs: boolean;
    setShowLauncherLogs: (show: boolean) => void;
    showGameLogs: boolean;
    setShowGameLogs: (show: boolean) => void;
    showReleases: boolean;
    setShowReleases: (show: boolean) => void;
    showPreviews: boolean;
    setShowPreviews: (show: boolean) => void;
    showBetas: boolean;
    setShowBetas: (show: boolean) => void;
    showInstalled: boolean;
    setShowInstalled: (show: boolean) => void;
    showServer: boolean;
    setShowServer: (show: boolean) => void;
    versionFilterString: string;
    setVersionFilterString: (filter: string) => void;
    getSettings: () => LauncherSettings;
}

const LauncherStateContext = createContext<ILauncherState | undefined>(undefined);
export const LauncherStateProvider = ({children}: { children: ReactNode }) => {
    const [keepLauncherOpen, setKeepLauncherOpen] = useState<boolean>(false);
    const [showLauncherLogs, setShowLauncherLogs] = useState<boolean>(false);
    const [showGameLogs, setShowGameLogs] = useState<boolean>(false);
    const [showReleases, setShowReleases] = useState<boolean>(true);
    const [showPreviews, setShowPreviews] = useState<boolean>(true);
    const [showBetas, setShowBetas] = useState<boolean>(true);
    const [showInstalled, setShowInstalled] = useState<boolean>(true);
    const [showServer, setShowServer] = useState<boolean>(true);
    const [versionFilterString, setVersionFilterString] = useState<string>('');
    useEffect(() => {
        const launcherSettings = LauncherCore.getSettings();
        setKeepLauncherOpen(launcherSettings.keep_open ?? true);
        setShowLauncherLogs(launcherSettings.show_launcher_logs ?? true);
        setShowGameLogs(launcherSettings.show_game_logs ?? true);
        setShowReleases(launcherSettings.show_releases_on_version_list ?? true);
        setShowPreviews(launcherSettings.show_previews_on_version_list ?? true);
        setShowBetas(launcherSettings.show_betas_on_version_list ?? true);
        setShowInstalled(launcherSettings.show_installed_on_version_list ?? true);
        setShowServer(launcherSettings.show_server_on_version_list ?? true);
        setVersionFilterString(launcherSettings.version_string_filter ?? '');
    }, []);

    const getSettings = () => {
        return {
            keep_open: keepLauncherOpen,
            show_launcher_logs: showLauncherLogs,
            show_game_logs: showGameLogs,
            show_releases_on_version_list: showReleases,
            show_previews_on_version_list: showPreviews,
            show_betas_on_version_list: showBetas,
            show_installed_on_version_list: showInstalled,
            show_server_on_version_list: showServer,
            version_string_filter: versionFilterString
        };
    };

    const [initialized, setInitialized] = useState<boolean>(false);
    const saveSettings = useCallback(() => {
        const launcherSettings: LauncherSettings = getSettings();
        LauncherCore.setSettings(launcherSettings);
    }, [keepLauncherOpen, showLauncherLogs, showGameLogs, showReleases, showPreviews, showBetas, showInstalled, showServer, versionFilterString]);

    

    useEffect(() => {
        if (!initialized) {
            setInitialized(true);
            return;
        }

        saveSettings();
    }, [keepLauncherOpen, showLauncherLogs, showGameLogs, showReleases, showPreviews, showBetas, showInstalled, showServer, versionFilterString]);

    return (
        <LauncherStateContext.Provider value={{
            keepLauncherOpen,
            setKeepLauncherOpen,
            showLauncherLogs,
            setShowLauncherLogs,
            showGameLogs,
            setShowGameLogs,
            showReleases,
            setShowReleases,
            showPreviews,
            setShowPreviews,
            showBetas,
            setShowBetas,
            showInstalled,
            setShowInstalled,
            showServer,
            setShowServer,
            versionFilterString,
            setVersionFilterString,
            getSettings
        }}>
            {children}
        </LauncherStateContext.Provider>
    )
}

export function useLauncherState() {
    const context = useContext(LauncherStateContext);
    if (!context) {
        throw new Error('useLauncherState must be used within a LauncherStateProvider');
    }
    return context;
}