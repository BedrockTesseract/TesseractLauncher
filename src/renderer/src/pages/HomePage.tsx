import ResizablePanel from "@renderer/components/ResizablePanel";
import "./HomePage.css"
import { useEffect } from "react";
import { useLauncherState } from "@renderer/states/LauncherState";
import { Task } from "@renderer/core/Task";
import { useTaskListState } from "@renderer/states/TaskListState";

export default function HomePage(): JSX.Element | null {
    const launcherState = useLauncherState();
    const taskListState = useTaskListState();

    return (
        <div className="home-page-container">
            <div className="blank-area"/>
            <ResizablePanel style={{width: "100%", height: "75px"}}/>
        </div>
    );
}