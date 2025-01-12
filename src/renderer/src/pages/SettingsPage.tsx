import ResizablePanel from "@renderer/components/ResizablePanel";
import "./SettingsPage.css"
import Switch from "@renderer/components/Switch";
import { useLauncherState } from "@renderer/states/LauncherState";
import Text from "@renderer/components/Text";
import { LauncherInfo } from "@renderer/utils/LauncherInfo";

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
            <ResizablePanel style={{ width: "100%", height: "auto", flexDirection: "column", alignItems: "flex-start", padding: "12px" }}>
                <Text>
                    Launcher Version: {LauncherInfo.version}
                </Text>
                <Text>
                    Launcher Developer: {LauncherInfo.developer}
                </Text>
                <Text>
                    Launcher License: {LauncherInfo.license}
                </Text>
                <Text style={{display: "flex", flexDirection: "row"}} onClick={() => {window.openExternalLink("https://github.com/BedrockTesseract/TesseractLauncher")}}>
                    Launcher Repository: https://github.com/BedrockTesseract/TesseractLauncher
                </Text>
                <div style={{height: "10px"}}/>
                <Text>
                    Not afiliated with Mojang Studios or Microsoft
                </Text>
            </ResizablePanel>
        </div>
    );
}