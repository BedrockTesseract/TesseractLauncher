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

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <BrowserRouter>
        <ErrorBoundary>
            <LauncherStateProvider>
                <TaskListStateProvider>
                    <App/>
                </TaskListStateProvider>
            </LauncherStateProvider>
        </ErrorBoundary>
    </BrowserRouter>
)