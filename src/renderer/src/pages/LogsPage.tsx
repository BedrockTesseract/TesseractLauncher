import Switch from "@renderer/components/Switch";
import "./LogsPage.css"
import ResizablePanel from "@renderer/components/ResizablePanel";
import { useLauncherState } from "@renderer/states/LauncherState";
import { ILoggerMessage, Logger } from "@renderer/utils/Logger";
import CircleButton from "@renderer/components/CircleButton";
import { ReactNode, RefObject, useCallback, useEffect, useReducer, useRef, useState } from "react";
import InfiniteLoader from "react-window-infinite-loader";
import { FixedSizeList, VariableSizeList } from "react-window";
import { CollectionView } from "@renderer/utils/CollectionView";
import { start } from "repl";
import Text from "@renderer/components/Text";

export default function LogsPage(): JSX.Element {
    const [, forceUpdate] = useReducer((x) => x + 1, 0);
    const [loadedItems, setLoadedItems] = useState<Map<number, ILoggerMessage>>(new Map());
    const launcherState = useLauncherState();

    const isItemLoaded = (index: number) => {
        return loadedItems.has(Logger.getMessagesCount() - index - 1);
    };

    const loadMoreItems = (startIndex: number, stopIndex: number) => {
        const oldStartIndex = startIndex;
        const oldStopIndex = stopIndex;

        const totalMessages = Logger.getMessagesCount();
        startIndex = Math.max(0, totalMessages - oldStopIndex - 1);
        stopIndex = Math.max(0, totalMessages - oldStartIndex);
        if (stopIndex <= startIndex) {
            return;
        }

        const view = Logger.getMessagesRange(startIndex, stopIndex);
        console.log("Loading items from " + startIndex + " to " + stopIndex);
        setLoadedItems((prev) => {
            const newItems = new Map(prev);
            view.forEach((item, index, trueIndex) => {
                console.log("View index: " + index + ", true index: " + trueIndex);
                newItems.set(index + startIndex, item);
                console.log("Loaded item " + (index + startIndex));
            });
            return newItems;
        });
    };

    const [containerHeight, setContainerHeight] = useState<number>(0);
    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (containerRef.current) {
            setContainerHeight(containerRef.current.clientHeight);
        }
    }, [containerRef.current]);

    return (
        <div className="logs-page-container">
            <div ref={containerRef} style={{width: "100%", height: "100%", display: "flex", flexDirection: "column"}}>
                <InfiniteLoader
                    isItemLoaded={isItemLoaded}
                    itemCount={Logger.getMessagesCount()}
                    loadMoreItems={loadMoreItems}
                    minimumBatchSize={1}
                >
                    {({onItemsRendered, ref}) => (
                        <FixedSizeList
                            height={containerHeight}
                            itemCount={Logger.getMessagesCount()}
                            itemSize={20}
                            onItemsRendered={onItemsRendered}
                            ref={ref}
                            width="100%"
                            itemKey={(index) => index}
                            overscanCount={20}
                        >
                            {({index, style}) => {
                                console.log(index)
                                const item = loadedItems.get(Logger.getMessagesCount() - index - 1);
                                if (item === undefined) return null;
                                return (
                                    <Text style={style}>{item.message}</Text>
                                );
                            }}
                        </FixedSizeList>
                    )}
                </InfiniteLoader>
            </div>
            <ResizablePanel style={{width: "100%", height: "auto", flexDirection: "column", padding: "10px"}}>
                <CircleButton onClick={() => {
                    Logger.clearMessages();
                    forceUpdate();
                }} style={{backgroundColor: "var(--charcoal)", width: "100%", height: "40px", borderRadius: "5px"}}>
                    <div className="logs-page-switch-text">
                        Clear Logs
                    </div>
                </CircleButton>
            </ResizablePanel>
        </div>
    );
}