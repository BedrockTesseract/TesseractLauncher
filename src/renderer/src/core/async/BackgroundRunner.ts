import { Logger } from "@renderer/utils/Logger";
import { ITask, Task } from "./Task";

export const BackgroundRunnerEvents = ['added', 'started', 'finished', 'removed'] as const;
export interface BackgroundRunnerEvent {
    added: (task: Task<any>) => void;
    started: (task: Task<any>) => void;
    finished: (task: Task<any>) => void;
    removed: (task: Task<any>) => void;
}

export namespace BackgroundRunner {
    let Tasks: Task<any>[] = [];
    let EventListeners: { [K in keyof BackgroundRunnerEvent]: BackgroundRunnerEvent[K][] } = getEmptyEventListeners();
    
    function addTask(task: Task<any>): void {
        Tasks.push(task);
        task.on('started', handleTaskStarted);
        task.on('completed', handleTaskFinished);
        task.on('failed', handleTaskFinished);
        emit('added', task);
    }

    function removeTask(task: Task<any>): void {
        Tasks = Tasks.filter(t => t !== task);
        task.off('started', handleTaskStarted);
        task.off('completed', handleTaskFinished);
        task.off('failed', handleTaskFinished);
        emit('removed', task);
    }

    export function run(task: Task<any>): Task<any> {
        addTask(task);
        (async () => {
            try {
                await task.runAsync();
            }
            catch (error) {
                Logger.error(error);
            }
        })();
        return task;
    }

    function handleTaskStarted(task: Task<any>): void {
        emit('started', task);
    }

    function handleTaskFinished(task: Task<any>): void {
        removeTask(task);
        emit('finished', task);
    }

    export function on<K extends keyof BackgroundRunnerEvent>(event: K, listener: BackgroundRunnerEvent[K]): void {
        EventListeners[event].push(listener);
    }

    export function off<K extends keyof BackgroundRunnerEvent>(event: K, listener: BackgroundRunnerEvent[K]): void {
        EventListeners[event] = EventListeners[event].filter(l => l !== listener);
    }

    export function emit<K extends keyof BackgroundRunnerEvent>(event: K, ...args: Parameters<BackgroundRunnerEvent[K]>): void {
        console.log(`BackgroundRunner emitting event '${event}' with args`, args);
        EventListeners[event].forEach(listener => (listener as (...args: any[]) => any)(...args));
    }

    export function clear(): void {
        Tasks = [];
    }

    export function getEmptyEventListeners() {
        return BackgroundRunnerEvents.reduce((listeners, event) => {
            listeners[event] = [];
            return listeners;
        }, {} as { [K in keyof BackgroundRunnerEvent]: BackgroundRunnerEvent[K][] })
    }

    export function isRunningAny(): boolean {
        return Tasks.length > 0;
    }

    export function getTasks(): Task<any>[] {
        return Tasks;
    }
}

