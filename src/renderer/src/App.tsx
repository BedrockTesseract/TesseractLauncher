import { Route, Routes, useLocation } from 'react-router'
import PageBar from './components/PageBar'
import TitleBar from './components/TitleBar'
import HomePage from './pages/HomePage'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import SettingsPage from './pages/SettingsPage'
import VersionsPage from './pages/VersionsPage'
import ErrorPopup from './components/ErrorPopup'
import AsyncTaskOverlay from './overlays/AsyncTaskOverlay'
import ConsolePage from './pages/ConsolePage'
import { useEffect } from 'react'
import TaskQueue from './core/async/TaskQueue'
import { Task } from './core/async/Task'
import { VersionManager } from './minecraft/VersionManager'
import { MinecraftVersion, MinecraftVersionType } from './minecraft/MinecraftVersion'
import { Version } from './utils/Version'
import DownloadedVersion from './minecraft/DownloadedVersion'

function App(): JSX.Element | null {
    const location = useLocation();
    useEffect(() => {
        TaskQueue.enqueue(Task.create<void>(async () => {
            await VersionManager.loadDownloadedVersions();
        }, 'Loading downloaded versions...', '', false));
    }, []);
    
    return (
        <div className='background'>
            <TitleBar />
            <div className='content'>
                <AsyncTaskOverlay />
                <PageBar buttons={
                    [
                        {
                            iconNode: <div className='home-icon' />,
                            text: 'Home',
                            route: '/'
                        },
                        {
                            iconNode: <div className='instances-icon' />,
                            text: 'Instances',
                            route: '/instances'
                        },
                        {
                            iconNode: <div className='versions-icon' />,
                            text: 'Versions',
                            route: '/versions'
                        },
                        {
                            iconNode: <div className='mods-icon' />,
                            text: 'Mods',
                            route: '/mods'
                        },
                        {
                            iconNode: <div className='console-icon' />,
                            text: 'Console',
                            route: '/console'
                        }
                    ]
                } lastButton={
                    {
                        iconNode: <div className='settings-icon' />,
                        text: 'Settings',
                        route: '/settings'
                    }
                } />
                <TransitionGroup style={{ width: '100%', height: '100%' }}>
                    <CSSTransition key={location.key} timeout={300} classNames='tpage'>
                        <div className='page-area'>
                            <ErrorPopup/>
                            <Routes>
                                <Route path='/' element={
                                    <HomePage />
                                } />
                                <Route path='/versions' element={
                                    <VersionsPage />
                                } />
                                <Route path='/settings' element={
                                    <SettingsPage />
                                } />
                                <Route path='/console' element={
                                    <ConsolePage />
                                } />
                            </Routes>
                        </div>
                    </CSSTransition>
                </TransitionGroup>
            </div>
        </div>
    )
}

export default App
