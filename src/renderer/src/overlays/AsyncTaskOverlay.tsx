import "./styles/AsyncTaskOverlay.css"
import { useEffect, useReducer, useState } from "react";
import ProgressBar from "@renderer/components/ProgressBar"
import Text from "@renderer/components/Text"
import { useMainTaskQueue } from "@renderer/states/MainTaskQueue"
import { Task } from "@renderer/core/Task";

export default function AsyncTaskOverlay() {
    const taskQueue = useMainTaskQueue();
    const [, forceUpdate] = useReducer((x) => x + 1, 0);

    const onTaskQueueEvent = (event: string, task: Task) => {
        if (event === 'enqueued') {
            task.addListener((task, state) => {
                forceUpdate();
            });
        }
    };

    useEffect(() => {
        taskQueue.addListener(onTaskQueueEvent);
        return () => {
            taskQueue.removeListener(onTaskQueueEvent);
        };
    });

    if (taskQueue.getCurrent() === null) {
        return null;
    }

    const task = taskQueue.getCurrent()!;
    return (
        <div className="async-task-overlay">
            <Text>{task.progressName}</Text>
            {task.progressDescription !== "" ? <Text style={{fontSize: "12px", filter: "brightness(75%)"}}>{task.progressDescription}</Text> : null}
            <ProgressBar marquee={!task.isDeterministic} value={task.isDeterministic ? task.progress : 1} width="80%" height="10px"/>
        </div>
    )
}