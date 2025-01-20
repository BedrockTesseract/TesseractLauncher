import { MinecraftVersion, MinecraftVersionType } from "./MinecraftVersion";

export default class DownloadedVersion {
    version: MinecraftVersion | null = null;
    dedicated_server: boolean = false;

    public static fromClearObject(json: ReturnType<DownloadedVersion["toClearObject"]>): DownloadedVersion | null {
        if (!("version" in json && "dedicated_server" in json))
            throw new Error("Invalid object missing members");
        const version = new DownloadedVersion();
        version.version = MinecraftVersion.fromClearObject(json.version);
        version.dedicated_server = json.dedicated_server;
        return version;
    }

    public toClearObject() {
        const version = this.version?.toClearObject();
        if (!version)
            throw new Error("Invalid version");
        return {
            version: version,
            dedicated_server: this.dedicated_server
        };
    }
};