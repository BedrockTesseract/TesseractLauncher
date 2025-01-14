import { CollectionView } from "./CollectionView";

export class CircularBuffer<T> {
    private buffer: (T | undefined)[];
    private head: number = 0; // Points to the oldest item
    private tail: number = 0; // Points to the next position for inserting an item
    private size: number = 0;

    constructor(private readonly capacity: number) {
        if (capacity <= 0) {
            throw new Error("Capacity must be greater than 0");
        }
        this.buffer = new Array(capacity);
    }

    // Add an item to the back of the buffer
    push(item: T): void {
        if (this.isFull()) {
            this.head = (this.head + 1) % this.capacity; // Overwrite the oldest item
        } else {
            this.size++;
        }
        this.buffer[this.tail] = item;
        this.tail = (this.tail + 1) % this.capacity;
    }

    // Remove the oldest item from the buffer
    shift(): T | undefined {
        if (this.isEmpty()) {
            return undefined; // Buffer is empty
        }
        const item = this.buffer[this.head];
        this.buffer[this.head] = undefined; // Optional: Clear the slot
        this.head = (this.head + 1) % this.capacity;
        this.size--;
        return item;
    }

    // Check if the buffer is full
    isFull(): boolean {
        return this.size === this.capacity;
    }

    // Check if the buffer is empty
    isEmpty(): boolean {
        return this.size === 0;
    }

    // Get the current size of the buffer
    getSize(): number {
        return this.size;
    }

    // Get all elements in the buffer
    toArray(): T[] {
        const result: T[] = [];
        for (let i = 0; i < this.size; i++) {
            result.push(this.buffer[(this.head + i) % this.capacity] as T);
        }
        return result;
    }

    toView(index?: number, count?: number): CollectionView<T> {
        this.validateRange(start, end);

    }

    validateRange(start?: number, end?: number): void {
        if (start === undefined)
            start = 0;
        if (end === undefined)
            end = this.size;
        if (start !== undefined && (start >= this.size || start < 0))
            throw new Error("Start index out of bounds");
        if (end !== undefined && (end - 1 >= this.size || end <= 0))
            throw new Error("End index out of bounds");
        if (start > end) {
            throw new Error("Start index cannot be greater than end index");
        }
    }
}