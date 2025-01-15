import { Version } from '@renderer/utils/Version';

export enum MinecraftVersionType {
    Release = 0,
    Beta = 1,
    Preview = 2
}

export class MinecraftVersion {
    public version: Version;
    public type: MinecraftVersionType;
    public uuid: string;

    constructor(version: Version, type: MinecraftVersionType, uuid: string) {
        this.version = version;
        this.type = type;
        this.uuid = uuid;
    }

    public static fromClearObject(obj: any): MinecraftVersion {
        if ('version' in obj && 'type' in obj && 'uuid' in obj) {
            return new MinecraftVersion(Version.fromString(obj.version), obj.type, obj.uuid);
        }

        throw new Error('Invalid object missing members');
    }

    public toClearObject(): any {
        return {
            version: this.version.toString(),
            type: this.type,
            uuid: this.uuid
        }
    }

    hasServerVersion(): boolean {
        return this.version.compare(Version.fromString('1.6.1.0')) >= 0 && this.type === MinecraftVersionType.Release;
    }
}