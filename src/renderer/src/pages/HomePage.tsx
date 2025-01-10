import ResizablePanel from "@renderer/components/ResizablePanel";
import "./HomePage.css"

export default function HomePage(): JSX.Element | null {
    return (
        <div className="home-page-container">
            <div className="blank-area"/>
            <ResizablePanel style={{width: "100%", height: "75px"}}/>
        </div>
    );
}