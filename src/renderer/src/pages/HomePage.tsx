import ResizablePanel from "@renderer/components/ResizablePanel";
import "./HomePage.css"
import { useEffect } from "react";
import { useLauncherState } from "@renderer/states/LauncherState";
import { Task } from "@renderer/core/Task";
import { useTaskListState } from "@renderer/states/TaskListState";

export default function HomePage(): JSX.Element | null {
    const launcherState = useLauncherState();
    const taskListState = useTaskListState();

    useEffect(() => {
        const task = new Task("Test Task", "This is a test task", true, async () => {
            for (let i = 0; i < 100; i++) {
                await new Promise((resolve) => setTimeout(resolve, 100));
                task.setProgress(i / 100);
            }
        });
        taskListState.addTask(task);
        task.run();
    }, [true]);

    return (
        <div className="home-page-container">
            <div className="blank-area"/>
            <ResizablePanel style={{width: "100%", height: "75px"}}/>
        </div>
    );
}