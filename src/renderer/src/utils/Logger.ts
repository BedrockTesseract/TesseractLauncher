import { CollectionView } from "./CollectionView";

export interface ILoggerMessage {
    message: string;
    level: "trace" | "warn" | "error";
    timestamp: number;
}

export class Logger {
    public static readonly MAX_MESSAGES: number = 1000000;
    private static _messages: ILoggerMessage[] = Array.from({ length: Logger.MAX_MESSAGES });
    private static _cursor: number = 0;
    private static _counter: number = 0;
    static trace(...args: any[]) {
        Logger._messages[Logger.getAndDisplaceCursor()] = { message: args.join(" "), level: "trace", timestamp: Date.now() };
        Logger._counter++;
        console.trace(...args);
    }

    static warn(...args: any[]) {
        Logger._messages[Logger.getAndDisplaceCursor()] = { message: args.join(" "), level: "warn", timestamp: Date.now() };
        Logger._counter++;
        console.warn(...args);
    }

    static error(...args: any[]) {
        Logger._messages[Logger.getAndDisplaceCursor()] = { message: args.join(" "), level: "error", timestamp: Date.now() };
        Logger._counter++;
        console.error(...args);
    }

    static getMessages() {
        return Logger._messages;
    }

    static getMessagesRange(start: number, end: number) {
        return CollectionView.fromRange(Logger._messages, start, end);
    }

    static getMessagesCount() {
        return Logger._counter;
    }

    static clearMessages() {
        Logger._messages = [];
    }

    private static getAndDisplaceCursor() {
        const newCursor = Logger._cursor % Logger.MAX_MESSAGES;
        Logger._cursor++;
        if (Logger._cursor >= Logger.MAX_MESSAGES) Logger._cursor = 0;
        return newCursor;
    }
}