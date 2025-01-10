import { WindowControls } from "@renderer/utils/WindowControls"
import CircleButton from "./CircleButton"
import "./TitleBar.css"

export default function TitleBar(): JSX.Element | null {
    return (
        <div className='top-bar'>
            <div className="drag-region">
                <div className="window-info-container ">
                    <div className="window-icon"/>
                    <div className="window-title">Tesseract</div>
                </div>
            </div>
            <div className="buttons-container">
                <CircleButton onClick={() => WindowControls.minimize()}>
                    <div className="subtract-icon"/>
                </CircleButton>
                <CircleButton onClick={() => WindowControls.maximize()}>
                    <div className="maximize-icon"/>
                </CircleButton>
                <CircleButton onClick={() => WindowControls.close()} style={{backgroundColor: "#FF0000"}}>
                    <div className="close-icon"/>
                </CircleButton>
            </div>
        </div>
    )
}