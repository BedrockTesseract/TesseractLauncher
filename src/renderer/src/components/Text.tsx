import { ReactNode } from "react";
import "./Text.css"

export default function Text(props: {
    children: ReactNode,
    style?: React.CSSProperties
} | React.ComponentProps<'div'>): JSX.Element {
    const { children, ...rest } = props;
    return (
        <div className="text-main" {...rest}>
            {children}
        </div>
    );
}