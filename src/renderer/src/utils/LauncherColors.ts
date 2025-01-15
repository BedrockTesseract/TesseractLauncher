export class LauncherColors {
    static initialize() {
        
    }

    static getColor(colorName: string): string {
        colorName = colorName.startsWith('--') === false ? colorName = `--${colorName}` : colorName;
        return getComputedStyle(document.documentElement).getPropertyValue(colorName).trim();
    }

    static setColor(colorName: string, value: string): void {
        colorName = colorName.startsWith('--') === false ? colorName = `--${colorName}` : colorName;
        document.documentElement.style.setProperty(colorName, value);
    }
}