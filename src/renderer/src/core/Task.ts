import { CancellationToken } from './CancellationToken';

const crypto = require('crypto') as typeof import('crypto');

export type TaskState = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
export type TaskEvent = 'changed_property';

export class Task {
    private _id: string = crypto.randomUUID();
    private _name: string = '';
    private _description: string = '';
    private _state: TaskState = 'pending';
    private _token: CancellationToken | null = null;
    private _task: ((task: Task) => Promise<void>) | null = null;
    private _onEvent: ((task: Task, state: TaskState | TaskEvent) => void)[] = [];
    private _result: any = null;
    private _isDeterministic: boolean = false;
    private _taskProgressName: string = '';
    private _taskProgressDescription: string = '';
    private _taskProgress: number = 0;

    private constructor() {}

    public static create(name: string, description: string, taskFn: (task: Task) => Promise<void>, token: CancellationToken | undefined = undefined, deterministic: boolean = false) {
        const task = new Task();
        task._name = name;
        task._description = description;
        task._task = taskFn;
        task._token = token ?? CancellationToken.create(() => {
            task._state = 'cancelled';
            task._onEvent.forEach(callback => callback(task, 'cancelled'));
        });
        task._taskProgressName = name;
        task._taskProgressDescription = description;
        task._isDeterministic = deterministic;
        return task;
    }

    public run() {
        if (this._state !== 'pending') {
            return;
        }

        this._state = 'running';
        this._onEvent.forEach(callback => callback(this, 'running'));
        this._task?.(this).then(() => {
            if (this._token?.cancelled) {
                return;
            }
            this._state = 'completed';
            this._onEvent.forEach(callback => callback(this, 'completed'));
        }).catch((e) => {
            if (this._token?.cancelled) {
                return;
            }
            this._state = 'failed';
            this._result = e;
            this._onEvent.forEach(callback => callback(this, 'failed'));
        });
    }

    public addListener(callback: (task: Task, state: TaskState | TaskEvent) => void) {
        this._onEvent.push(callback);
    }

    public removeListener(callback: (task: Task, state: TaskState | TaskEvent) => void) {
        const index = this._onEvent.indexOf(callback);
        if (index !== -1) {
            this._onEvent.splice(index, 1);
        }
    }

    public clearListeners() {
        this._onEvent = [];
    }

    public get id() {
        return this._id;
    }

    public get name() {
        return this._name;
    }

    public get description() {
        return this._description;
    }

    public get state() {
        return this._state;
    }

    public get result() {
        return this._result;
    }

    public get token() {
        return this._token;
    }

    public get isDeterministic() {
        return this._isDeterministic;
    }

    public get progress() {
        return this._taskProgress;
    }

    public get progressName() {
        return this._taskProgressName;
    }

    public get progressDescription() {
        return this._taskProgressDescription;
    }

    public setProgressName(name: string) {
        this._taskProgressName = name;
        this._onEvent.forEach(callback => callback(this, 'changed_property'));
    }

    public setProgressDescription(description: string) {
        this._taskProgressDescription = description;
        this._onEvent.forEach(callback => callback(this, 'changed_property'));
    }

    public setProgress(progress: number) {
        this._taskProgress = progress;
        this._onEvent.forEach(callback => callback(this, 'changed_property'));
    }

    public cancel() {
        this._token?.cancel();
    }
};