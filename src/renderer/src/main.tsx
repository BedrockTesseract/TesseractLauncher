import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router'
import { TransitionGroup } from 'react-transition-group'
import { LauncherStateProvider } from './states/LauncherState'
import { TaskListStateProvider } from './states/TaskListState'
import { Logger } from './utils/Logger'
import ErrorBoundary from './components/ErrorBoundary'
import ErrorPopup from './components/ErrorPopup'
import { ErrorPopupStateProvider } from './states/ErrorPopupState'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <BrowserRouter>
        <ErrorBoundary>
            <ErrorPopupStateProvider>
                <LauncherStateProvider>
                    <TaskListStateProvider>
                        <App/>
                    </TaskListStateProvider>
                </LauncherStateProvider>
            </ErrorPopupStateProvider>
        </ErrorBoundary>
    </BrowserRouter>
)