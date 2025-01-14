import "./styles/ErrorPopup.css"
import { useErrorPopupState } from "@renderer/states/ErrorPopupState";

export default function ErrorPopup() {
    const errorPopupState = useErrorPopupState();
    return (
        <div className="error-popup" style={{ display: errorPopupState.getVisible() ? "flex" : "none", animation: errorPopupState.getAnimation() }}>
            {errorPopupState.getCurrentElement()}
        </div>
    );
}