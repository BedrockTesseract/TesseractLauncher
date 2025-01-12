import { useState } from "react";
import * as ReactSwitch from "react-switch";

export default function Switch(
    {
        onChange,
        checked,
        width = 56,
        height = 28
    }: { 
        onChange?: (v: boolean) => void, 
        checked?: boolean,
        width?: number,
        height?: number,
    }
): JSX.Element | null {
    const [isChecked, setChecked] = useState(checked ?? false);
    return (
        <ReactSwitch.default 
            onChange={(v) => {
                setChecked(v);
                onChange?.(v);
            }}
            checked={isChecked}
            uncheckedIcon={false}
            checkedIcon={false}
            onColor="#324a5f"
            offColor="#324a5f"
            onHandleColor="#32a852"
            offHandleColor="#a83232"
            width={width}
            height={height}
            handleDiameter={height - 2}>
        </ReactSwitch.default>
    );
}