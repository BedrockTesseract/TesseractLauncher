import { WindowControls } from "@renderer/utils/WindowControls"
import CircleButton from "./CircleButton"
import "./TitleBar.css"
import { useLauncherState } from "@renderer/states/LauncherState"
import { useEffect, useRef, useState } from "react";
import TaskList from "./TaskList";
import ProgressBar, { ProgressBarHandle } from "./ProgressBar";
import { Task } from "@renderer/core/Task";
import { useTaskListState } from "@renderer/states/TaskListState";
import Text from "./Text";
import { LauncherInfo } from "@renderer/utils/LauncherInfo";

export default function TitleBar(): JSX.Element | null {
    const launcherState = useLauncherState();
    const taskListState = useTaskListState();
    const [isTaskRunning, setIsTaskRunning] = useState<boolean>(false);
    const [isTasksVisible, setIsTasksVisible] = useState<boolean>(false);

    useEffect(() => {
        const onTaskAny = (task: Task) => {
            setIsTaskRunning(taskListState.getTaskList().some((x) => x.getState() === "running"));
        };

        taskListState.addListener("add", onTaskAny);
        taskListState.addListener("remove", onTaskAny);
        taskListState.addListener("task_start", onTaskAny);
        taskListState.addListener("task_update", onTaskAny);
        taskListState.addListener("task_end", onTaskAny);
        taskListState.addListener("task_error", onTaskAny);
        return () => {
            taskListState.removeListener("add", onTaskAny);
            taskListState.removeListener("remove", onTaskAny);
            taskListState.removeListener("task_start", onTaskAny);
            taskListState.removeListener("task_update", onTaskAny);
            taskListState.removeListener("task_end", onTaskAny);
            taskListState.removeListener("task_error", onTaskAny);
        };
    }, []);

    // const onAddTask = (task: Task) => {
    //     setIsTaskRunning(taskListState.taskList.some((x) => x.getState() === "running"));
    //     console.log("added task", taskListState.taskList);
    // };

    // const onRemoveTask = (task: Task) => {
    //     setIsTaskRunning(taskListState.taskList.some((x) => x.getState() === "running"));
    //     console.log("removed task", taskListState.taskList);
    // };

    // useEffect(() => {
    //     taskListState.addListener("add", onAddTask);
    //     taskListState.addListener("remove", onRemoveTask);
    //     return () => {
    //         taskListState.removeListener("add", onAddTask);
    //         taskListState.removeListener("remove", onRemoveTask);
    //     };
    // }, []);

    return (
        <div className='top-bar'>
            <div className="drag-region">
                <div className="window-info-container ">
                    <div className="window-icon"/>
                    <div className="window-title">Tesseract</div>
                    <div style={{width: "7px"}}></div>
                    <Text style={{filter: "brightness(70%)", fontSize: "12px"}}>{LauncherInfo.version}</Text>
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