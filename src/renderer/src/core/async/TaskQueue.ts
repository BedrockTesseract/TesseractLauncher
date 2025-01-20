import { Queue } from "@renderer/utils/Queue";
import { ITask, Task } from "./Task";

export type TaskQueueEventTypeMap = {
    enqueued: (task: ITask) => void;
    dequeued: (task: ITask) => void;
    finished: (task: ITask) => void;
    starting: (task: ITask) => void;
};

export default class TaskQueue {
    private static _queue: Queue<Task<any>> = new Queue();
    private static _current: ITask | null = null;
    private static _running: boolean = false;
    private static _eventListeners: Map<keyof TaskQueueEventTypeMap, TaskQueueEventTypeMap[keyof TaskQueueEventTypeMap][]> = new Map();

    public static enqueue<T>(task: Task<T>): void {
        TaskQueue._queue.enqueue(task);
        TaskQueue.emit('enqueued', task);
        TaskQueue.run();
    }

    private static run(): void {
        if (TaskQueue._running)
            return;
        TaskQueue._running = true;
        (async () => {
            while (!TaskQueue._queue.isEmpty()) {
                const task = TaskQueue._queue.dequeue();
                if (!task)
                    continue;
                TaskQueue.emit('dequeued', task);
                try {
                    TaskQueue._current = task;
                    TaskQueue.emit('starting', task);
                    await task.runAsync();
                }
                catch (error) {
                    console.error(`Task ${task.id} failed with error:`, error);
                }
                TaskQueue._current = null;
                TaskQueue.emit('finished', task);
            }
            TaskQueue._running = false;
        })();
    }

    public static get current(): ITask | null {
        return TaskQueue._current;
    }

    public static on<K extends keyof TaskQueueEventTypeMap>(event: K, listener: TaskQueueEventTypeMap[K]): void {
        const listeners = TaskQueue._eventListeners.get(event) ?? [];
        listeners.push(listener);
        TaskQueue._eventListeners.set(event, listeners);
    }

    public static off<K extends keyof TaskQueueEventTypeMap>(event: K, listener: TaskQueueEventTypeMap[K]): void {
        const listeners = TaskQueue._eventListeners.get(event) ?? [];
        const index = listeners.indexOf(listener);
        if (index !== -1) {
            listeners.splice(index, 1);
            TaskQueue._eventListeners.set(event, listeners);
        }
    }

    public static emit<K extends keyof TaskQueueEventTypeMap>(event: K, ...args: Parameters<TaskQueueEventTypeMap[K]>): void {
        const listeners = TaskQueue._eventListeners.get(event);
        console.log(`TaskQueue emitting event '${event}' with args`, args);
        if (listeners) {
            listeners.forEach((listener) => (listener as ((...args: any[]) => any))(...args));
        }
    }

    public static isRunning(): boolean {
        return TaskQueue._running;
    }
}