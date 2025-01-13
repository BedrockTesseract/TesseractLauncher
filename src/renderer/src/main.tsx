import './assets/main.css'

import React from 'react'
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

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <BrowserRouter>
        <ErrorBoundary>
            <ErrorPopupStateProvider>
                <LauncherStateProvider>
                    <MainTaskQueueProvider>
                        <App/>
                    </MainTaskQueueProvider>
                </LauncherStateProvider>
            </ErrorPopupStateProvider>
        </ErrorBoundary>
    </BrowserRouter>
)