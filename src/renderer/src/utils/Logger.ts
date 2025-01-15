import { CollectionView } from './CollectionView';

export interface ILoggerFormatted {
    message: string;
    color: string;
    unformatted: ILoggerMessage;
}

export type LogLevel = 'trace' | 'warn' | 'error';

export class ILoggerMessage {
    message: string = '';
    level: LogLevel = 'trace';
    timestamp: number = 0;

    constructor(message: string, level: LogLevel, timestamp: number) {
        this.message = message;
        this.level = level;
        this.timestamp = timestamp;
    }

    toFormatted(): ILoggerFormatted {
        let date = new Date(this.timestamp);
        let hours = String(date.getHours()).padStart(2, '0');
        let minutes = String(date.getMinutes()).padStart(2, '0');
        let seconds = String(date.getSeconds()).padStart(2, '0');
        let formattedTime = `${hours}:${minutes}:${seconds}`;
        let color = this.level === 'trace' ? 'var(--trace-color)' : this.level === 'warn' ? 'var(--warn-color)' : 'var(--error-color)';    
        return {
            message: `[${formattedTime}] [Launcher/${this.level}] ${this.message}`,
            color: color,
            unformatted: this
        };
    }
}

export class Logger {
    public static readonly MAX_MESSAGES: number = 1000;
    private static _messages: ILoggerMessage[] = Array.from({ length: Logger.MAX_MESSAGES });

    private static _onMessage: ((message: ILoggerMessage) => void)[] = [];
    static write(level: LogLevel, ...args: any[]) {
        const message = new ILoggerMessage(args.join(' '), level, Date.now());
        Logger._messages.push(message);
        if (Logger._messages.length > Logger.MAX_MESSAGES) {
            Logger._messages.shift();
        }
        this._onMessage.forEach((cb) => cb(message));
        switch (level) {
            case 'trace':
                console.log(...args);
                break;
            case 'warn':
                console.warn(...args);
                break;
            case 'error':
                console.error(...args);
                break;
        }
    }

    static trace(...args: any[]) {
        Logger.write('trace', ...args);
    }

    static warn(...args: any[]) {
        Logger.write('warn', ...args);
    }

    static error(...args: any[]) {
        Logger.write('error', ...args);
    }

    static getMessages() {
        return Logger._messages;
    }

    static getMessagesRange(start: number, end: number) {
        return CollectionView.fromRange(Logger._messages, start, end);
    }

    static getMessagesCount() {
        return Logger._messages.length;
    }

    static addMessageListener(callback: (message: ILoggerMessage) => void) {
        Logger._onMessage.push(callback);
    }

    static removeMessageListener(callback: (message: ILoggerMessage) => void) {
        Logger._onMessage = Logger._onMessage.filter((cb) => cb !== callback);
    }

    static clear() {
        Logger._messages = [];
    }
}