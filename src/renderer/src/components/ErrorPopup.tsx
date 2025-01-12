import { forwardRef, useImperativeHandle } from "react";

interface ErrorPopupProps {

}

export interface ErrorPopupHandle {

}

const ErrorPopup = forwardRef<ErrorPopupHandle, ErrorPopupProps>((props, ref) => {
    useImperativeHandle(ref, () => ({

    }));

    return (
        
    );
});