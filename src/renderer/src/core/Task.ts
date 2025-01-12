import { ILauncherState } from "@renderer/states/LauncherState";

export type TaskState = "idle" | "running" | "finished" | "error";
export type TaskEvent = "start" | "update" | "end" | "error";
export type TaskCallback = (task: Task) => Promise<void>;
export type TaskErrorCallback = (task: Task, error: any) => Promise<void>;
export class Task {
    private _state: TaskState = "idle";
    private _task: TaskCallback = async () => {};
    private _name: string;
    private _description: string;
    private _deterministic: boolean;
    private _progress: number = 0;
    private _onTaskStart: TaskCallback[] = [];
    private _onTaskUpdate: TaskCallback[] = [];
    private _onTaskEnd: TaskCallback[] = [];
    private _onTaskError: TaskErrorCallback[] = [];
    
    constructor(name: string, description: string, deterministic: boolean = false, task: (task: Task) => Promise<void> = async () => {}) {
        this._state = "idle";
        this._task = task;
        this._name = name;
        this._description = description;
        this._deterministic = deterministic;
    }

    run() {
        new Promise<void>(async (resolve, reject) => {
            this._state = "running";
            try {
                this._onTaskStart.forEach(async (x) => await x(this));
                await this._task(this);
                this._state = "finished";
                this._onTaskEnd.forEach(async (x) => await x(this));
                resolve();
            } catch (e) {
                this._state = "error";
                this._onTaskError.forEach(async (x) => await x(this, e));
                reject();
            }
        });
    }

    addListener(event: TaskEvent, callback: any) {
        switch (event) {
            case "start":
                this._onTaskStart.push(callback);
                break;
            case "update":
                this._onTaskUpdate.push(callback);
                break;
            case "end":
                this._onTaskEnd.push(callback);
                break;
            case "error":
                this._onTaskError.push(callback);
                break;
        }
    }

    removeListener(event: TaskEvent, callback: any) {
        switch (event) {
            case "start":
                this._onTaskStart = this._onTaskStart.filter((x) => x !== callback);
                break;
            case "update":
                this._onTaskUpdate = this._onTaskUpdate.filter((x) => x !== callback);
                break;
            case "end":
                this._onTaskEnd = this._onTaskEnd.filter((x) => x !== callback);
                break;
            case "error":
                this._onTaskError = this._onTaskError.filter((x) => x !== callback);
                break;
        }
    }

    updateTask() {
        this._onTaskUpdate.forEach(async (x) => await x(this));
    }

    getState() {
        return this._state;
    }

    getName() {
        return this._name;
    }

    getDescription() {
        return this._description;
    }

    isDeterministic() {
        return this._deterministic;
    }

    getProgress() {
        return this._progress;
    }

    setName(name: string) {
        this._name = name;
        this.updateTask();
    }

    setDescription(description: string) {
        this._description = description;
        this.updateTask();
    }

    setDeterministic(deterministic: boolean) {
        this._deterministic = deterministic;
        this.updateTask();
    }

    setProgress(progress: number) {
        this._progress = progress;
        this.updateTask();
    }
}