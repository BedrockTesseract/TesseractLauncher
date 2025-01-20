export class Queue<T> {
    private _items: T[] = [];
    
    constructor() {
        this._items = [];
    }

    public enqueue(item: T) {
        this._items.push(item);
        return this;
    }

    public dequeue(): T | undefined {
        return this._items.shift();
    }

    public peek(): T | undefined {
        return this._items[0];
    }

    public get length(): number {
        return this._items.length;
    }

    public get items(): T[] {
        return this._items;
    }

    public clear() {
        this._items = [];
    }

    public forEach(callback: (item: T, index: number) => void) {
        this._items.forEach(callback);
    }

    public map<U>(callback: (item: T, index: number) => U): U[] {
        return this._items.map(callback);
    }

    public filter(callback: (item: T, index: number) => boolean): T[] {
        return this._items.filter(callback);
    }

    public find(callback: (item: T, index: number) => boolean): T | undefined {
        return this._items.find(callback);
    }

    public isEmpty(): boolean {
        return this._items.length === 0;
    }

    static fromArray<T>(array: T[]): Queue<T> {
        const queue = new Queue<T>();
        queue._items = array;
        return queue;
    }
}