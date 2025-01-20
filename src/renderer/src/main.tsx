import './assets/styles/main.scss'
import './assets/styles/colors.scss'
import React, { StrictMode } from 'react'

import './utils/ExtensionMethods'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router'
import { TransitionGroup } from 'react-transition-group'
import { LauncherStateProvider } from './states/LauncherState'
import { Logger } from './utils/Logger'
import ErrorBoundary from './components/ErrorBoundary'
import ErrorPopup from './components/ErrorPopup'
import { ErrorPopupStateProvider } from './states/ErrorPopupState'
import { LauncherColors } from './utils/LauncherColors'
import { VersionManager } from './minecraft/VersionManager'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <BrowserRouter>
        <ErrorPopupStateProvider>
            <LauncherStateProvider>
                <App/>
            </LauncherStateProvider>
        </ErrorPopupStateProvider>
    </BrowserRouter>
)