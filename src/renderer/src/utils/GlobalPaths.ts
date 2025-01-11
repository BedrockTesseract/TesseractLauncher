const path = window.require('path') as typeof import('path');
const appDataPath = process.env.APPDATA ?? "";
export const LAUNCHER_PATH = path.join(appDataPath, "/Tesseract/Launcher");
console.log(LAUNCHER_PATH);