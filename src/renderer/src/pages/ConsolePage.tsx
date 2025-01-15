import { ILoggerMessage, Logger } from "@renderer/utils/Logger";
import "./styles/ConsolePage.css";
import { ReactNode, useEffect, useReducer, useRef } from "react";
import Text from "@renderer/components/Text";
import { UUID } from "@renderer/utils/UUID";
import ResizablePanel from "@renderer/components/ResizablePanel";
import Button from "@renderer/components/Button";

const ConsolePage: React.FC = (): ReactNode => {
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const containerRef = useRef<HTMLDivElement>(null);

    const parsedMessages = Logger.getMessages().map((message) => {
        if (!message) return null;
        const formatted = message.toFormatted();
        return (
            <div className="console-message" style={{backgroundColor: formatted.color}} key={UUID.create()}>
                <Text style={{ 
                    wordBreak: "break-all",
                    whiteSpace: "pre-line",
                }}>
                    {formatted.message}
                </Text>
            </div>
        );
    }).filter(x => x !== null);

    const handleNewMessages = (message: ILoggerMessage) => {
        forceUpdate();
    };

    useEffect(() => {
        Logger.addMessageListener(handleNewMessages);
        return () => {
            Logger.removeMessageListener(handleNewMessages);
        };
    }, []);

    const [firstRun, setFirstRun] = useReducer(() => false, true);
    useEffect(() => {
        if (containerRef.current) {
            const scrollDifference = containerRef.current.scrollHeight - containerRef.current.scrollTop;
            console.log("Difference", scrollDifference);
            if (firstRun) {
                containerRef.current.scrollTop = containerRef.current.scrollHeight;
                setFirstRun();
            }

            if (scrollDifference <= containerRef.current.clientHeight + 60) {
                console.log("On bottom");
                containerRef.current.scrollTop = containerRef.current.scrollHeight;
            }
        }
    });

    return (
        <div className="console-page">
            <div ref={containerRef} className="console-message-list">
                {parsedMessages}
            </div>
            <ResizablePanel style={{height: "auto", padding: "10px"}}>
                <Button style={{width: "100%", height: "50px", borderRadius: "5px", backgroundColor: "var(--charcoal)"}} onClick={() => {
                    Logger.clear();
                    forceUpdate();
                }}>
                    <Text>Clear Console</Text>
                </Button>
            </ResizablePanel>
        </div>
    );
};

export default ConsolePage;