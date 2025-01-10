import React from "react";
import "./CircleButton.css"

interface CircleButtonProps {
    onClick?: () => void, 
    children?: React.ReactNode,
    style?: React.CSSProperties
};

export default function CircleButton(
{ 
    onClick,
    children,
    style
}: CircleButtonProps
): JSX.Element | null {
    return (
        <div className="circle-btn-container" style={style} onClick={onClick}>
            {children}
        </div>
    );
}