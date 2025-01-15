const path = window.require('path') as typeof import('path');
const appDataPath = process.env.APPDATA ?? '';
export const LAUNCHER_PATH = path.join(appDataPath, '/Tesseract/Launcher');
export const CACHED_VERSIONS_FILE = path.join(LAUNCHER_PATH, 'cached_versions.json');
console.log(LAUNCHER_PATH);