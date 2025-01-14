import crypto from 'crypto';
export class UUID {
    static create() {
        return crypto.randomUUID();
    }
}