export class CollectionView<T> {
    private _items: T[] = [];
    private _start: number = 0;
    private _end: number = 0;

    constructor() {}

    public get length(): number {
        return this._end - this._start;
    }

    public get start(): number {
        return this._start;
    }

    public get end(): number {
        return this._end;
    }

    public static fromRange<T>(array: T[], start?: number, end?: number): CollectionView<T> {
        const view = new CollectionView<T>();
        view._items = array;
        CollectionView.validateRange(array, start, end);
        view._start = start ?? 0;
        view._end = end ?? array.length - 1;
        return view;
    }

    public displaceTo(start: number, end: number): CollectionView<T> {
        CollectionView.validateRange(this._items, start, end);
        this._start = start;
        this._end = end;
        return this;
    }

    public displaceBy(index: number, count: number): CollectionView<T> {
        CollectionView.validateRange(this._items, index, index + count);
        this._start += index;
        this._end = this._start + count;
        return this;
    }

    public get(index: number): T {
        if (index >= this._items.length || index < 0)
            throw new Error("Index out of bounds");
        return this._items[index];
    }

    public toArray(): T[] {
        return this._items.slice(this._start, this._end);
    }

    public forEach(callback: (value: T, index: number, trueIndex: number, array: CollectionView<T>) => void): void {
        for (let i = this._start; i < this._end; i++) {
            callback(this._items[i], i - this.start, i, this);
        }
    }

    public map<U>(callback: (value: T, index: number, trueIndex: number, array: CollectionView<T>) => U): U[] {
        const result: U[] = [];
        for (let i = this._start; i < this._end; i++) {
            result.push(callback(this._items[i], i - this.start, i, this));
        }
        return result;
    }

    private static validateRange(array: any[], start?: number, end?: number): void {
        if (start === undefined)
            start = 0;
        if (end === undefined)
            end = array.length - 1;
        if (start !== undefined && (start >= array.length || start < 0))
            throw new Error("Start index out of bounds");
        if (end !== undefined && (end - 1 >= array.length || end <= 0))
            throw new Error("End index out of bounds");
        if (start > end) {
            throw new Error("Start index cannot be greater than end index");
        }
    }

    public toString() {
        return `Start: ${this._start}, End: ${this._end}, Length: ${this.length}, Items: ${this.toArray()}`;
    }
}