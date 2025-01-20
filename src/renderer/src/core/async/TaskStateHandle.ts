import { TaskState } from "./TaskState";

export type TaskStateListenerType = 'stateChanged' | 'propertyChanged';
export const TaskStatePropertyNames = ['progressValue', 'progressMarquee', 'progressName', 'progressMessage', 'progressError'] as const;
export type TaskStatePropertyType = typeof TaskStatePropertyNames[number];
export interface TaskStateEventMap {
    stateChanged: (handle: TaskStateHandle) => void;
    propertyChanged: (handle: TaskStateHandle, property: TaskStatePropertyType) => void;
}

export class TaskStateHandle {
    private _taskState: TaskState = 'pending';
    private _progressValue: number = 0;
    private _progressMarquee: boolean = false;
    private _progressName: string = '';
    private _progressMessage: string = '';
    private _progressError: any = null;
    private _eventListeners: Map<TaskStateListenerType, TaskStateEventMap[keyof TaskStateEventMap][]> = new Map();

    constructor(progress: number, marquee: boolean, name: string, message: string, error: any) {
        this._progressValue = progress;
        this._progressMarquee = marquee;
        this._progressName = name;
        this._progressMessage = message;
        this._progressError = error;
    }

    public get taskState(): TaskState {
        return this._taskState;
    }

    public get progressValue(): number {
        return this._progressValue;
    }

    public get progressMarquee(): boolean {
        return this._progressMarquee;
    }

    public get progressName(): string {
        return this._progressName;
    }

    public get progressMessage(): string {
        return this._progressMessage;
    }

    public get progressError(): any {
        return this._progressError;
    }

    public set taskState(value: TaskState) {
        if (this._taskState !== value) {
            this._taskState = value;
            this.emit('stateChanged', this);
        }
    }

    public set progressValue(value: number) {
        if (this._progressValue !== value) {
            this._progressValue = value;
            this.emit('propertyChanged', this, 'progressValue');
        }
    }

    public set progressMarquee(value: boolean) {
        if (this._progressMarquee !== value) {
            this._progressMarquee = value;
            this.emit('propertyChanged', this, 'progressMarquee');
        }
    }

    public set progressName(value: string) {
        if (this._progressName !== value) {
            this._progressName = value;
            this.emit('propertyChanged', this, 'progressName');
        }
    }

    public set progressMessage(value: string) {
        if (this._progressMessage !== value) {
            this._progressMessage = value;
            this.emit('propertyChanged', this, 'progressMessage');
        }
    }

    public set progressError(value: any) {
        if (this._progressError !== value) {
            this._progressError = value;
            this.emit('propertyChanged', this, 'progressError');
        }
    }

    public on<K extends TaskStateListenerType>(event: K, callback: TaskStateEventMap[K]) {
        const listeners = this._eventListeners.get(event) ?? [];
        listeners.push(callback);
        this._eventListeners.set(event, listeners);
    }

    public off<K extends TaskStateListenerType>(event: K, callback: TaskStateEventMap[K]) {
        const listeners = this._eventListeners.get(event) ?? [];
        const index = listeners.indexOf(callback);
        if (index !== -1) {
            listeners.splice(index, 1);
            this._eventListeners.set(event, listeners);
        }
    }

    public emit<K extends TaskStateListenerType>(event: K, ...args: Parameters<TaskStateEventMap[K]>) {
        const listeners = this._eventListeners.get(event);
        if (listeners) {
            listeners.forEach((listener) => (listener as ((...args: any[]) => any))(...args));
        }
    }
}