import Library from "@renderer/utils/Library";
const fs = Library.load<typeof import('fs')>('fs');

import { DOWNLOADED_VERSIONS_FILE } from "@renderer/utils/GlobalPaths";
import DownloadedVersion from "./DownloadedVersion";
import TaskQueue from "@renderer/core/async/TaskQueue";
import { Task } from "@renderer/core/async/Task";
import { Version } from "@renderer/utils/Version";

export namespace VersionManager {
    let Initialized = false;
    let DownloadedVersions: DownloadedVersion[] = [];

    export async function loadDownloadedVersions(): Promise<DownloadedVersion[]> {
        if (Initialized)
            return DownloadedVersions;
        Initialized = true;
        try {
            const contents = await fs.promises.readFile(DOWNLOADED_VERSIONS_FILE, { encoding: 'utf-8' });
            const json = JSON.parse(contents);
            DownloadedVersions = json.map((obj: ReturnType<DownloadedVersion["toClearObject"]>) => DownloadedVersion.fromClearObject(obj));
            return DownloadedVersions;
        }
        catch (error) {
            return [];
        }
    }

    export async function saveDownloadedVersions(): Promise<void> {
        if (!Initialized)
            return;
        const json = JSON.stringify(DownloadedVersions.map(v => v.toClearObject()));
        await fs.promises.writeFile(DOWNLOADED_VERSIONS_FILE, json, { encoding: 'utf-8' });
    }

    export async function getDownloadedVersions(): Promise<DownloadedVersion[]> {
        if (!Initialized)
            await loadDownloadedVersions();
        return DownloadedVersions;
    }

    export async function addDownloadedVersion(version: DownloadedVersion): Promise<void> {
        if (!Initialized)
            await loadDownloadedVersions();
        DownloadedVersions.push(version);
        await saveDownloadedVersions();
    }

    export async function removeDownloadedVersion(version: DownloadedVersion): Promise<void> {
        if (!Initialized)
            await loadDownloadedVersions();
        const index = DownloadedVersions.indexOf(version);
        if (index === -1)
            return;
        DownloadedVersions.splice(index, 1);
        await saveDownloadedVersions();
    }

    export async function getDownloadedVersionById(uuid: string): Promise<DownloadedVersion | undefined> {
        if (!Initialized)
            await loadDownloadedVersions();
        return DownloadedVersions.find(v => v.version?.uuid === uuid);
    }

    
}