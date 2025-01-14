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
            show_launcher_logs: true,
            show_game_logs: true,
            show_releases_on_version_list: true,
            show_previews_on_version_list: true,
            show_betas_on_version_list: true,
            show_installed_on_version_list: true,
            show_server_on_version_list: true,
            version_string_filter: "",
            ...data
        };
    }

    static setSettings(settings: LauncherSettings) {
        fs.mkdirSync(LAUNCHER_PATH, { recursive: true });
        fs.writeFileSync(`${LAUNCHER_PATH}/launcher_settings.json`, JSON.stringify(settings, null, 4));
    }
}