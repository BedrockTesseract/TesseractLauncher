import React from "react";
import "./CircleButton.css"

interface CircleButtonProps {
    underlyingRef?: React.RefObject<HTMLDivElement>;
};

export default function CircleButton(props: CircleButtonProps & React.ComponentProps<'div'>
): JSX.Element | null {
    const {underlyingRef, ...rest} = props;
    return (
        <div className="circle-btn-container" ref={underlyingRef} {...rest}/>
    );
}