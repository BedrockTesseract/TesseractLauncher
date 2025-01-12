import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router'
import { TransitionGroup } from 'react-transition-group'
import { LauncherStateProvider } from './states/LauncherState'
import { TaskListStateProvider } from './states/TaskListState'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <BrowserRouter>
        <LauncherStateProvider>
            <TaskListStateProvider>
                <App/>
            </TaskListStateProvider>
        </LauncherStateProvider>
    </BrowserRouter>
)
