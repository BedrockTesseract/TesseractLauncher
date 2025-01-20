import { UUID } from "@renderer/utils/UUID";
import { TaskState } from "./TaskState";
import { TaskStateHandle } from "./TaskStateHandle";
import { CancellationToken } from "./CancellationToken";
import { OmitFirst } from "@renderer/utils/Types";

export interface ITask {
    id: string;
    name: string;
    description: string;
    state: TaskStateHandle;
    result: any;
    on<K extends TaskEventType>(event: K, callback: TaskEventTypeMap<any>[K]): void;
    off<K extends TaskEventType>(event: K, callback: TaskEventTypeMap<any>[K]): void;
    emit<K extends TaskEventType>(event: K, ...args: Parameters<TaskEventTypeMap<any>[K]>): void;
}

export type TaskFunction<T> = (task: Task<T>) => Promise<T | null>;
export type TaskEventType = 'started' | 'completed' | 'failed';
export type TaskStartEvent<T> = (task: Task<T>) => void;
export type TaskCompletedEvent<T> = (task: Task<T>, result: T | null) => void;
export type TaskFailedEvent<T> = (task: Task<T>, error: any) => void;
export type TaskEvent<T> = TaskStartEvent<T> | TaskCompletedEvent<T> | TaskFailedEvent<T>;
export interface TaskEventTypeMap<T> {
    started: TaskStartEvent<T>;
    completed: TaskCompletedEvent<T>;
    failed: TaskFailedEvent<T>;
}

export class Task<T> implements ITask {
    id: string;
    name: string;
    description: string;
    state: TaskStateHandle;
    result: T | null;
    private fn: TaskFunction<T> | null = null;
    private events: Map<TaskEventType, TaskEvent<T>[]> = new Map();

    public constructor(id: string, name: string, description: string, deterministic: boolean) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.state = new TaskStateHandle(0, !deterministic, name, description, null);
        this.result = null;
    }

    public static create<T>(fn: TaskFunction<T>, ...args: OmitFirst<ConstructorParameters<typeof Task<T>>>): Task<T> {
        const t = new Task<T>(UUID.create(), ...args);
        t.fn = fn;
        return t;
    }

    private start(): void {
        if (this.state.taskState !== 'pending')
            return;
        this.state.taskState = 'running';
        this.emit('started', this);
    }

    private finish(result: T | null): void {
        if (this.state.taskState !== 'running')
            return;
        this.result = result;
        this.state.taskState = 'completed';
        this.emit('completed', this, result);
    }

    private fail(error: any): void {
        if (this.state.taskState !== 'running')
            return;
        this.state.progressError = error;
        this.state.taskState = 'failed';
        this.emit('failed', this, error);
    }

    public run() {
        this.start();
        this.fn?.(this).then((result) => {
            this.finish(result ?? null);
        }, (error) => {
            this.fail(error);
        }).catch((error) => {
            this.fail(error);
        });
    }

    public async runAsync(): Promise<T | null>{
        try {
            this.start();
            const result = await this.fn?.(this) ?? null;
            this.finish(result);
            return result;
        } catch (error) {
            this.fail(error);
            throw error;
        }
    }

    public on<K extends TaskEventType>(event: K, callback: TaskEventTypeMap<T>[K]) {
        this.events.set(event, [...(this.events.get(event) ?? []), callback]);
        return this;
    }

    public off<K extends TaskEventType>(event: K, callback: TaskEventTypeMap<T>[K]) {
        const callbacks = this.events.get(event);
        if (callbacks) {
            this.events.set(event, callbacks.filter(cb => cb !== callback));
        }
        return this;
    }

    public emit<K extends TaskEventType>(event: K, ...args: Parameters<TaskEventTypeMap<T>[K]>) {
        const callbacks = this.events.get(event);
        console.log(`Task emitting event '${event}' with args`, args);
        if (callbacks) {
            callbacks.forEach(cb => {
                (cb as ((...all: any[]) => any))(...args);
            });
        }
    }

    public toString(): string {
        return `Task(${this.id})[${this.name}]`;
    }
}