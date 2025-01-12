import { WindowControls } from "@renderer/utils/WindowControls"
import CircleButton from "./CircleButton"
import "./TitleBar.css"
import { useLauncherState } from "@renderer/states/LauncherState"
import { useEffect, useRef, useState } from "react";
import TaskList, { TaskListHandle } from "./TaskList";
import ProgressBar, { ProgressBarHandle } from "./ProgressBar";
import { Task } from "@renderer/core/Task";

export default function TitleBar(): JSX.Element | null {
    const launcherState = useLauncherState();
    const [isTaskRunning, setIsTaskRunning] = useState<boolean>(false);
    const [isTasksVisible, setIsTasksVisible] = useState<boolean>(false);

    const taskListRef = useRef<TaskListHandle>(null);

    useEffect(() => {
        if (taskListRef.current === null)
            return;
        launcherState.setTaskList(taskListRef.current);
    }, []);

    useEffect(() => {
        if (taskListRef.current === null)
            return;
        setIsTaskRunning(taskListRef.current.getAllTasks().some((x) => x.getState() === "running"));
    }, [taskListRef.current?.getAllTasks()]);

    return (
        <div className='top-bar'>
            <div className="drag-region">
                <div className="window-info-container ">
                    <div className="window-icon"/>
                    <div className="window-title">Tesseract</div>
                </div>
            </div>
            <div className="task-container" onClick={() => setIsTasksVisible(!isTasksVisible)}>
                <div className="clickable-task-button" style={{display: isTaskRunning ? "flex" : "none"}}>
                    {isTaskRunning ? <ProgressBar marquee={true}/> : null}
                    <TaskList visible={isTasksVisible}/>
                </div>
                
            </div>
            <div className="separator"/>
            <div className="buttons-container">
                
                <CircleButton onClick={() => WindowControls.minimize()}>
                    <div className="subtract-icon"/>
                </CircleButton>
                <CircleButton onClick={() => WindowControls.maximize()}>
                    <div className="maximize-icon"/>
                </CircleButton>
                <CircleButton onClick={() => WindowControls.close()} style={{backgroundColor: "#FF0000"}}>
                    <div className="close-icon"/>
                </CircleButton>
            </div>
        </div>
    )
}