import "./styles/Text.css"
import { ReactNode } from "react";

export default function Text(props: {
    children: ReactNode,
    style?: React.CSSProperties,
    underlyingRef?: React.LegacyRef<HTMLDivElement>,
} & React.ComponentProps<'div'>): JSX.Element {
    const { children, key, underlyingRef, ...rest } = props;
    return (
        <div key={key} className="text-main" ref={underlyingRef} {...rest}>
            {children}
        </div>
    );
}