import "./assets/styles/main.css"
import './assets/styles/colors.scss'
import React, { StrictMode } from 'react'

import "./utils/ExtensionMethods"
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router'
import { TransitionGroup } from 'react-transition-group'
import { LauncherStateProvider } from './states/LauncherState'
import { Logger } from './utils/Logger'
import ErrorBoundary from './components/ErrorBoundary'
import ErrorPopup from './components/ErrorPopup'
import { ErrorPopupStateProvider } from './states/ErrorPopupState'
import { MainTaskQueueProvider } from './states/MainTaskQueue'
import { LauncherColors } from "./utils/LauncherColors"

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <StrictMode>
        <BrowserRouter>
            <ErrorPopupStateProvider>
                <LauncherStateProvider>
                    <MainTaskQueueProvider>
                        <App/>
                    </MainTaskQueueProvider>
                </LauncherStateProvider>
            </ErrorPopupStateProvider>
        </BrowserRouter>
    </StrictMode>
)