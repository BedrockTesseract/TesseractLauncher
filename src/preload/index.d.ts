import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    require: NodeRequire
    openExternalLink: (url: string) => void
  }
}
