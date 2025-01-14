const crypto = window.require('crypto') as typeof import('crypto');
export class UUID {
    static create() {
        return crypto.randomUUID();
    }
}