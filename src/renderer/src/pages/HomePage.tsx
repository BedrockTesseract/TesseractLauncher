import ResizablePanel from "@renderer/components/ResizablePanel";
import "./styles/HomePage.css"
import { useEffect } from "react";
import { useLauncherState } from "@renderer/states/LauncherState";
import { Task } from "@renderer/core/Task";

export default function HomePage(): JSX.Element | null {
    const launcherState = useLauncherState();

    return (
        <div className="home-page-container">
            <div className="blank-area"/>
            <ResizablePanel style={{width: "100%", height: "75px"}}/>
        </div>
    );
}