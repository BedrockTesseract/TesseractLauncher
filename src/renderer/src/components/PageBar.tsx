import "./styles/PageBar.css"
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";

export interface PageButton {
    iconNode: JSX.Element,
    text: string,
    route: string
}

interface PageBarProps {
    buttons?: PageButton[],
    lastButton?: PageButton
}

export default function PageBar({
    buttons,
    lastButton
}: PageBarProps
): JSX.Element | null {
    const [selected, setSelected] = useState<number | undefined>(undefined);
    const navigate = useNavigate();
    const location = useLocation();
    const nodeButtons = buttons?.map((button, index) => {
        return (
            <div key={`page-selector-button-${index}`} className={`selector-button${location.pathname === button.route ? "-selected" : ""}`} onClick={() => {
                if (location.pathname === button.route)
                    return;
                setSelected(index);
                navigate(button.route);
            }}>
                <div className="selector-button-items">
                    {button.iconNode}
                    <div className="selector-button-text">{button.text}</div>
                </div>
            </div>
        )
    });

    const lastButtonNode = lastButton ? (
        <div key={`page-selector-button-${nodeButtons?.length ?? 0}`} className={`selector-button${location.pathname === lastButton?.route ? "-selected" : ""}`} onClick={() => {
            if (location.pathname === lastButton.route)
                return;
            setSelected((nodeButtons?.length ?? 0));
            navigate(lastButton.route);
        }}>
            <div className="selector-button-items">
                {lastButton.iconNode}
                <div className="selector-button-text">{lastButton.text}</div>
            </div>
        </div>
    ) : null;

    return (
        <div className="page-bar-main">
            <div className="page-bar-buttons-container">
                {nodeButtons}
            </div>
            {lastButtonNode}
        </div>
    )
}