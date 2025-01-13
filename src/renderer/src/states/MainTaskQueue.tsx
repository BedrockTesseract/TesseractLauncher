import { CancellationToken } from "@renderer/core/CancellationToken";
import { Task } from "@renderer/core/Task";
import { Logger } from "@renderer/utils/Logger";
import { Queue } from "@renderer/utils/Queue";
import { createContext, useContext, useEffect, useState } from "react";

export interface IMainTaskQueue {
    enqueue: (name: string, description: string, taskFn: (task: Task) => Promise<void>, token?: CancellationToken, deterministic?: boolean) => Task;
    getCurrent: () => Task | null;
    addListener: (callback: (event: MainTaskQueueEvent, task: Task) => void) => void;
    removeListener: (callback: (event: MainTaskQueueEvent, task: Task) => void) => void;
    clearListeners: () => void;
}

export type MainTaskQueueEvent = 'enqueued' | 'dequeued';
const eventListeners: ((event: MainTaskQueueEvent, task: Task) => void)[] = [];
const MainTaskQueueContext = createContext<IMainTaskQueue | undefined>(undefined);
export const MainTaskQueueProvider = ({ children }: { children: React.ReactNode }) => {
    const [tasks, setTasks] = useState<Queue<Task>>(new Queue());
    const [running, setRunning] = useState<boolean>(false);
    const [current, setCurrent] = useState<Task | null>(null);
    useEffect(() => {
        if (tasks.length > 0 && !running) {
            const task = tasks.dequeue();
            setTasks(tasks);
            if (task) {
                setRunning(true);
                setCurrent(task);
                task.run();
                task.addListener((task, state) => {
                    if (state === 'completed' || state === 'failed' || state === 'cancelled') {
                        setRunning(false);
                        setCurrent(null);
                        eventListeners.forEach(callback => callback('dequeued', task));
                    }
                });
            }
        }
    });

    const enqueue = (name: string, description: string, taskFn: (task: Task) => Promise<void>, token?: CancellationToken, deterministic?: boolean) => {
        const task = Task.create(name, description, taskFn, token, deterministic);
        tasks.enqueue(task);
        setTasks(tasks);
        eventListeners.forEach(callback => callback('enqueued', task));
        return task;
    };

    return (
        <MainTaskQueueContext.Provider value={{
            enqueue,
            getCurrent: () => current,
            addListener: (callback) => eventListeners.push(callback),
            removeListener: (callback) => {
                const index = eventListeners.indexOf(callback);
                if (index !== -1) {
                    eventListeners.splice(index, 1);
                }
            },
            clearListeners: () => eventListeners.splice(0, eventListeners.length),
        }}>
            {children}
        </MainTaskQueueContext.Provider>
    );
};

export function useMainTaskQueue() {
    const context = useContext(MainTaskQueueContext);
    if (!context) {
        throw new Error("useMainTaskQueue must be used within a MainTaskQueueProvider");
    }
    return context;
}