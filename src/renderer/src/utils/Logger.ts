export interface ILoggerMessage {
    message: string;
    level: "trace" | "warn" | "error";
    timestamp: number;
}

export class Logger {
    private static _messages:ILoggerMessage[] = [];
    static trace(...args: any[]) {
        Logger._messages.push({ message: args.join(" "), level: "trace", timestamp: Date.now() });
        console.trace(...args);
    }

    static warn(...args: any[]) {
        Logger._messages.push({ message: args.join(" "), level: "warn", timestamp: Date.now() });
        console.warn(...args);
    }

    static error(...args: any[]) {
        Logger._messages.push({ message: args.join(" "), level: "error", timestamp: Date.now() });
        console.error(...args);
    }

    static getMessages() {
        return Logger._messages;
    }

    static clearMessages() {
        Logger._messages = [];
    }
}