import Switch from "@renderer/components/Switch";
import "./LogsPage.css"
import ResizablePanel from "@renderer/components/ResizablePanel";
import { useLauncherState } from "@renderer/states/LauncherState";
import { Logger } from "@renderer/utils/Logger";
import CircleButton from "@renderer/components/CircleButton";
import { useReducer } from "react";

function stripFormattingTags(message) {
    // Replace formatting tags (%c, %s, etc.)
    return message.replace(/^[a-z-]+:\s*.+;$/i, '');
  }

export default function LogsPage(): JSX.Element {
    const launcherState = useLauncherState();
    const [, forceUpdate] = useReducer((x) => x + 1, 0);
    const launcherLogsElements = Logger.getMessages().map((log, index) => {
        let date = new Date(log.timestamp);
        let hours = String(date.getHours()).padStart(2, '0');
        let minutes = String(date.getMinutes()).padStart(2, '0');
        let seconds = String(date.getSeconds()).padStart(2, '0');
        let formattedTime = `${hours}:${minutes}:${seconds}`;

        var separateLines = log.message.split(/\r?\n|\r|\n/g);

        let color = "var(--trace-color)";
        if (log.level === "warn") {
            color = "var(--warn-color)";
        } else if (log.level === "error") {
            color = "var(--error-color)";
        }

        return (
            {
                timestamp: log.timestamp,
                element: (
                    <div key={`launcher-log-item-${index}`} className="console-item" style={{backgroundColor: color}}>
                        {separateLines.map((line, index) => {return <div className="console-item-text">{`[${formattedTime}] [Launcher/${log.level}] ${line}`}</div>})}
                    </div>
                )
            }
        );
    });

    const finalLogElements = [...(launcherState.showLauncherLogs ? launcherLogsElements : [])].sort((a, b) => (a.timestamp - b.timestamp)).map((x) => x.element);
    return (
        <div className="logs-page-container">
            <div className="console-area">
                {finalLogElements}
            </div>
            <ResizablePanel style={{width: "100%", height: "auto", flexDirection: "column"}}>
                <div className="logs-page-switch-group">
                    <Switch width={40} height={20} checked={launcherState.showLauncherLogs} onChange={(x) => launcherState.setShowLauncherLogs(x)}/>
                    <div className="logs-page-switch-text">
                        Launcher logs
                    </div>
                </div>
                <div className="logs-page-switch-group">
                    <Switch width={40} height={20} checked={launcherState.showGameLogs} onChange={(x) => launcherState.setShowGameLogs(x)}/>
                    <div className="logs-page-switch-text">
                        Game/Server logs
                    </div>
                </div>
                <CircleButton onClick={() => {
                    Logger.clearMessages();
                    forceUpdate();
                }} style={{backgroundColor: "var(--charcoal)", width: "100%", height: "40px", borderRadius: "5px"}}>
                    <div className="logs-page-switch-text">
                        Clear Logs
                    </div>
                </CircleButton>
            </ResizablePanel>
        </div>
    );
}