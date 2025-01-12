import ResizablePanel from "@renderer/components/ResizablePanel";
import "./HomePage.css"
import { useEffect } from "react";
import { useLauncherState } from "@renderer/states/LauncherState";
import { Task } from "@renderer/core/Task";

export default function HomePage(): JSX.Element | null {
    const launcherState = useLauncherState();
    useEffect(() => {
        const task = new Task("Test Task", "This is a test task", false, async (task) => { 
            await new Promise(r => setTimeout(r, 5000));
            task.setName("Halfway");
            await new Promise(r => setTimeout(r, 2000));
        });
        launcherState.taskList?.addTask(task);
        task.run();
        console.log("Test", launcherState.taskList)
    }, [launcherState.taskList]);

    return (
        <div className="home-page-container">
            <div className="blank-area"/>
            <ResizablePanel style={{width: "100%", height: "75px"}}/>
        </div>
    );
}