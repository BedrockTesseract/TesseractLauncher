import { LauncherCore } from "@renderer/core/LauncherCore";
import LauncherSettings from "@renderer/core/LauncherSettings";
import { Task } from "@renderer/core/Task";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

export type TaskListEvent = "add" | "remove" | "task_start" | "task_update" | "task_end" | "task_error";

export interface ITaskListState {
    getTaskList: () => Task[];
    setTaskList: (taskList: Task[]) => void;
    addListener: (event: TaskListEvent, callback: (task: Task) => void) => void;
    removeListener: (event: TaskListEvent, callback: (task: Task) => void) => void;
    clearListeners: (event: TaskListEvent) => void;
    clearAllListeners: () => void;
    addTask: (task: Task) => void;
    removeTask: (task: Task) => void;
}

var taskList: Task[] = [];
var onTaskStartListeners: ((task: Task) => void)[] = [];
var onTaskUpdateListeners: ((task: Task) => void)[] = [];
var onTaskEndListeners: ((task: Task) => void)[] = [];
var onTaskErrorListeners: ((task: Task) => void)[] = [];
const TaskListStateContext = createContext<ITaskListState | undefined>(undefined);
export const TaskListStateProvider = ({children}: { children: ReactNode }) => {    
    

    const addTask = (task: Task) => {
        taskList = [...taskList, task];
        console.log("added task", taskList);
        onAddListeners.forEach((x) => x(task));
    };

    const removeTask = (task: Task) => {
        taskList = taskList.filter((x) => x !== task);
        onRemoveListeners.forEach((x) => x(task));
    };

    const addTaskEvent = (task: Task) => {
        task.addListener("start", async (task) => {
            onTaskStartListeners.forEach((x) => x(task));
        });
        task.addListener("update", async (task) => {
            onTaskUpdateListeners.forEach((x) => x(task));
        });
        task.addListener("end", async (task) => {
            onTaskEndListeners.forEach((x) => x(task));
            removeTask(task);
        });
        task.addListener("error", async (task) => {
            onTaskErrorListeners.forEach((x) => x(task));
            removeTask(task);
        });
    };

    const removeTaskEvent = (task: Task) => {
        task.removeListener("start", async (task) => {
            onTaskStartListeners.forEach((x) => x(task));
        });
        task.removeListener("update", async (task) => {
            onTaskUpdateListeners.forEach((x) => x(task));
        });
        task.removeListener("end", async (task) => {
            onTaskEndListeners.forEach((x) => x(task));
            removeTask(task);
        });
        task.removeListener("error", async (task) => {
            onTaskErrorListeners.forEach((x) => x(task));
            removeTask(task);
        });
    };

    const [onAddListeners, setOnAddListeners] = useState<((task: Task) => void)[]>([addTaskEvent]);
    const [onRemoveListeners, setOnRemoveListeners] = useState<((task: Task) => void)[]>([removeTaskEvent]);

    const addListener = (event: TaskListEvent, callback: (task: Task) => void) => {
        switch (event) {
            case "add":
                setOnAddListeners([...onAddListeners, callback]);
                break;
            case "remove":
                setOnRemoveListeners([...onRemoveListeners, callback]);
                break;
            case "task_start":
                onTaskStartListeners = [...onTaskStartListeners, callback];
                break;
            case "task_update":
                onTaskUpdateListeners = [...onTaskUpdateListeners, callback];
                break;
            case "task_end":
                onTaskEndListeners = [...onTaskEndListeners, callback];
                break;
            case "task_error":
                onTaskErrorListeners = [...onTaskErrorListeners, callback];
                break;
        }
    };

    const removeListener = (event: TaskListEvent, callback: (task: Task) => void) => {
        switch (event) {
            case "add":
                setOnAddListeners(onAddListeners.filter((x) => x !== callback));
                break;
            case "remove":
                setOnRemoveListeners(onRemoveListeners.filter((x) => x !== callback));
                break;
            case "task_start":
                onTaskStartListeners = onTaskStartListeners.filter((x) => x !== callback);
                break;
            case "task_update":
                onTaskUpdateListeners = onTaskUpdateListeners.filter((x) => x !== callback);
                break;
            case "task_end":
                onTaskEndListeners = onTaskEndListeners.filter((x) => x !== callback);
                break;
            case "task_error":
                onTaskErrorListeners = onTaskErrorListeners.filter((x) => x !== callback);
                break;
        }
    };

    const clearListeners = (event: TaskListEvent) => {
        switch (event) {
            case "add":
                setOnAddListeners([addTaskEvent]);
                break;
            case "remove":
                setOnRemoveListeners([removeTaskEvent]);
                break;
        }
    };

    const clearAllListeners = () => {
        setOnAddListeners([addTaskEvent]);
        setOnRemoveListeners([removeTaskEvent]);
    };

    return (
        <TaskListStateContext.Provider value={{
            getTaskList: () => taskList,
            setTaskList: (tasks: Task[]) => taskList = tasks,
            addListener,
            removeListener,
            clearListeners,
            clearAllListeners,
            addTask,
            removeTask
        }}>
            {children}
        </TaskListStateContext.Provider>
    )
}

export function useTaskListState() {
    const context = useContext(TaskListStateContext);
    if (!context) {
        throw new Error("useTaskListState must be used within a TaskListStateProvider");
    }
    return context;
}