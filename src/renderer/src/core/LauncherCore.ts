import LauncherSettings from "./LauncherSettings";
const fs = window.require('fs') as typeof import('fs');

class LauncherCore {
    static getSettings(): LauncherSettings {
        let data: Partial<LauncherSettings> = {};
        try {
            data = JSON.parse(fs.readFileSync('launcher_settings.json', 'utf-8'));
        } catch (e) {
            console.error('Failed to read settings file', e);
        }

        return {
            ...data
        };
    }

    static setSettings(settings: LauncherSettings) {
        
    }
}