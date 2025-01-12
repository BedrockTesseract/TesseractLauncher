import { useLauncherState } from "@renderer/states/LauncherState";
import "./TaskList.css"
import ProgressBar, { ProgressBarHandle } from "./ProgressBar";
import { forwardRef, useImperativeHandle, useReducer, useRef, useState } from "react";
import { Task } from "@renderer/core/Task";

interface TaskListProps {
    visible?: boolean
}

export interface TaskListHandle {
    forceUpdate: () => void;
    addTask(task: Task): void;
    getAllTasks(): Task[];
}

const TaskList = forwardRef<TaskListHandle, TaskListProps>(({ visible }, ref) => {
    const launcherState = useLauncherState();
    const [, forceUpdate] = useReducer((x) => x + 1, 0);
    const [tasks, setTasks] = useState<Task[]>([]);

    useImperativeHandle(ref, () => ({
        forceUpdate: () => forceUpdate(),
        addTask: (task: Task) => {
            setTasks([...tasks, task]);
            task.addListener("start", async () => forceUpdate());
            task.addListener("update", async () => forceUpdate());
            task.addListener("end", async () => {
                setTasks(tasks.filter((x) => x !== task));
                forceUpdate()
            });
            task.addListener("error", async () => {
                setTasks(tasks.filter((x) => x !== task));
                forceUpdate()
            });
            task.run();
        },
        getAllTasks: () => tasks
    }));

    const elements = tasks.map((task, index) => {
        if (task.getState() != "running")
            return null;

        return (
            <div key={index} className="task-item">
                <div key={`task-item-${0}`} className="task-item">
                    <div className="task-item-name">{task.getName()}</div>
                    <div className="task-item-desc">{task.getDescription()}</div>
                    <ProgressBar width={"100%"} height={"5px"} marquee={!task.isDeterministic()} style={{ marginTop: "7.5px", backgroundColor: "var(--rich-black)" }}/>
                </div>
            </div>
        );
    }).filter((x) => x !== null);

    return (
        <div className="task-list" style={{display: visible ? "block" : "none"}}>
            {elements}
        </div>
    );
});

export default TaskList;