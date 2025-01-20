export class CancellationToken {
    private _cancelled: boolean = false;
    private _onCancelled: (() => void)[] = [];

    public get cancelled() {
        return this._cancelled;
    }

    public cancel() {
        if (this._cancelled) {
            return;
        }

        this._cancelled = true;
        this._onCancelled.forEach(callback => callback());
    }

    public addListener(callback: () => void) {
        this._onCancelled.push(callback);
    }

    public removeListener(callback: () => void) {
        const index = this._onCancelled.indexOf(callback);
        if (index !== -1) {
            this._onCancelled.splice(index, 1);
        }
    }

    public clearListeners() {
        this._onCancelled = [];
    }

    public static create(callback: () => void) {
        const token = new CancellationToken();
        token.addListener(callback);
        return token;
    }
}