const { ipcRenderer } = window.require("electron");

export class WindowControls {
    static close() {
        ipcRenderer.send("WINDOW_SIGNAL", "close");
    }

    static maximize() {
        ipcRenderer.send("WINDOW_SIGNAL", "maximize");
    }

    static minimize() {
        ipcRenderer.send("WINDOW_SIGNAL", "minimize");
    }
}