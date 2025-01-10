import { Route, Routes, useLocation } from "react-router"
import PageBar from "./components/PageBar"
import TitleBar from "./components/TitleBar"
import HomePage from "./pages/HomePage"
import { CSSTransition, TransitionGroup } from "react-transition-group"
import SettingsPage from "./pages/SettingsPage"

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
