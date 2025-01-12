import { CACHED_VERSIONS_FILE } from "@renderer/utils/GlobalPaths";
import { MinecraftVersion } from "./MinecraftVersion";
import { Logger } from "@renderer/utils/Logger";
import { Version } from "@renderer/utils/Version";
const fs = window.require('fs') as typeof import('fs')

export class VersionList {
    private static _versions: MinecraftVersion[] = [];
    static async downloadVersionList(sourceUrl: string = "https://raw.githubusercontent.com/BedrockTesseract/Launcher-Data/refs/heads/main/versions.json.min") {
        let lastWriteTime: Date = new Date(0);

        if (fs.existsSync(CACHED_VERSIONS_FILE)) {
            const fileInfo = fs.statSync(CACHED_VERSIONS_FILE);
            lastWriteTime = fileInfo.mtime;
        }

        const currentTime = new Date();
        const discardOldDataTime = new Date(currentTime.getTime() - 60 * 60 * 1000);

        if (lastWriteTime < discardOldDataTime) {
            Logger.trace(
                'Fetching minecraft versions from ' + sourceUrl + ' because the data is older than an hour'
            );
            const data = await fetch(sourceUrl)

            if (!data.ok) {
                throw new Error(
                    'Failed to fetch minecraft version data from https://raw.githubusercontent.com/AmethystAPI/Launcher-Data/main/versions.json.min'
                );
            }

            fs.writeFileSync(CACHED_VERSIONS_FILE, await data.text());
        }

        const versionData = fs.readFileSync(CACHED_VERSIONS_FILE, 'utf-8');
        const rawJson = JSON.parse(versionData);
        const versions: MinecraftVersion[] = [];

        for (const version of rawJson) {
            versions.push(
                MinecraftVersion.fromClearObject({
                    version: version[0],
                    uuid: version[1],
                    type: version[2]
                })
            );
        }

        VersionList._versions = versions;
        return versions;
    }

    static getVersions(): MinecraftVersion[] {
        return VersionList._versions;
    }
}