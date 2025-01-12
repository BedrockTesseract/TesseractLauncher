import { Route, Routes, useLocation } from "react-router"
import PageBar from "./components/PageBar"
import TitleBar from "./components/TitleBar"
import HomePage from "./pages/HomePage"
import { CSSTransition, TransitionGroup } from "react-transition-group"
import SettingsPage from "./pages/SettingsPage"
import { LauncherStateProvider } from "./states/LauncherState"
import VersionsPage from "./pages/VersionsPage"
import { useTaskListState } from "./states/TaskListState"
import { Task } from "./core/Task"
import { useEffect } from "react"

function App(): JSX.Element | null {
    const location = useLocation();
    return (
        <div className="background">
            <TitleBar />
            <div className="content">
                <PageBar buttons={
                    [
                        {
                            iconNode: <div className="home-icon" />,
                            text: "Home",
                            route: "/"
                        },
                        {
                            iconNode: <div className="instances-icon" />,
                            text: "Instances",
                            route: "/instances"
                        },
                        {
                            iconNode: <div className="versions-icon" />,
                            text: "Versions",
                            route: "/versions"
                        },
                        {
                            iconNode: <div className="mods-icon" />,
                            text: "Mods",
                            route: "/mods"
                        },
                        {
                            iconNode: <div className="logs-icon" />,
                            text: "Logs",
                            route: "/logs"
                        }
                    ]
                } lastButton={
                    {
                        iconNode: <div className="settings-icon" />,
                        text: "Settings",
                        route: "/settings"
                    }
                } />
                <TransitionGroup style={{ width: "100%", height: "100%" }}>
                    <CSSTransition key={location.key} timeout={300} classNames="tpage">
                        <div className="page-area">
                            <Routes>
                                <Route path="/" element={
                                    <HomePage />
                                } />
                                <Route path="/versions" element={
                                    <VersionsPage />
                                } />
                                <Route path="/settings" element={
                                    <SettingsPage />
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
