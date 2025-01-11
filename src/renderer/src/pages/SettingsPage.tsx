import ResizablePanel from "@renderer/components/ResizablePanel";
import "./SettingsPage.css"
import Switch from "@renderer/components/Switch";
import { useLauncherState } from "@renderer/states/LauncherState";

export default function SettingsPage(): JSX.Element | null {
    const launcherState = useLauncherState();
    return (
        <div className="settings-page-container">
            <ResizablePanel style={{ width: "100%", height: "auto" }}>
                <div className="settings-page-buttons-area">
                    <div className="settings-name-description-area">
                        <div className="settings-name-text">Keep Launcher Open</div>
                        <div className="settings-description-text">Keeps the launcher open when launching the game</div>
                    </div>
                    <Switch onChange={(value) => launcherState.setKeepLauncherOpen(value)} checked={launcherState.keepLauncherOpen}/>
                </div>
            </ResizablePanel>
        </div>
    );
}