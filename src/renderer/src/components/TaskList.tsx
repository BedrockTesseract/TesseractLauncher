import { useLauncherState } from "@renderer/states/LauncherState";
import "./TaskList.css"
import ProgressBar, { ProgressBarHandle } from "./ProgressBar";
import { forwardRef, useEffect, useImperativeHandle, useReducer, useRef, useState } from "react";
import { Task } from "@renderer/core/Task";

interface TaskListProps {
    visible?: boolean
}

export default function TaskList({ 
    visible 
}: TaskListProps
): JSX.Element {
    const launcherState = useLauncherState();
    const [, forceUpdate] = useReducer((x) => x + 1, 0);

    // useEffect(() => {
    //     const onTaskAny = (task: Task) => {
    //         forceUpdate();
    //     };

    //     taskListState.addListener("add", onTaskAny);
    //     taskListState.addListener("remove", onTaskAny);
    //     taskListState.addListener("task_start", onTaskAny);
    //     taskListState.addListener("task_update", onTaskAny);
    //     taskListState.addListener("task_end", onTaskAny);
    //     taskListState.addListener("task_error", onTaskAny);
    //     return () => {
    //         taskListState.removeListener("add", onTaskAny);
    //         taskListState.removeListener("remove", onTaskAny);
    //         taskListState.removeListener("task_start", onTaskAny);
    //         taskListState.removeListener("task_update", onTaskAny);
    //         taskListState.removeListener("task_end", onTaskAny);
    //         taskListState.removeListener("task_error", onTaskAny);
    //     };
    // }, []);

    // const elements = taskListState.getTaskList().map((task, index) => {
    //     if (task.getState() !== "running")
    //         return null;

    //     return (
    //         <div key={`task-item-${0}`} className="task-item">
    //             <div className="task-item-name">{task.getName()}</div>
    //             <div className="task-item-desc">{task.getDescription()}</div>
    //             {task.isDeterministic() ? <div style={{ width: "100%", display: "flex", justifyContent: "right" }}><div className="task-item-percent">{Math.floor(task.getProgress() * 100)}%</div></div> : null}
    //             <ProgressBar value={task.getProgress()} width={"100%"} height={"5px"} marquee={!task.isDeterministic()} style={{ marginTop: "7.5px", backgroundColor: "var(--rich-black)" }}/>
    //         </div>
    //     );
    // }).filter((x) => x !== null);

    return (
        <div className="task-list" style={{display: visible ? "block" : "none"}}>
            
        </div>
    );
};