import './styles/ResizablePanel.scss'

interface ResizablePanelProps {
    children?: JSX.Element | JSX.Element[],
    style?: React.CSSProperties
}

export default function ResizablePanel({
    children,
    style
}: ResizablePanelProps
): JSX.Element | null {
    return (
        <div className='resizable-panel' style={style}>
            {children}
        </div>
    );
}