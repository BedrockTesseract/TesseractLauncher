import { LAUNCHER_PATH } from "@renderer/utils/GlobalPaths";
import LauncherSettings from "./LauncherSettings";
const fs = window.require('fs') as typeof import('fs');

export class LauncherCore {
    static getSettings(): LauncherSettings {
        let data: Partial<LauncherSettings> = {};
        try {
            data = JSON.parse(fs.readFileSync(`${LAUNCHER_PATH}/launcher_settings.json`, 'utf-8'));
        } catch (e) {
            console.error('Failed to read settings file', e);
        }

        return {
            keep_open: false,
            ...data
        };
    }

    static setSettings(settings: LauncherSettings) {
        fs.mkdirSync(LAUNCHER_PATH, { recursive: true });
        fs.writeFileSync(`${LAUNCHER_PATH}/launcher_settings.json`, JSON.stringify(settings, null, 4));
    }
}