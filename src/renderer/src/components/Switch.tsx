import { useState } from "react";
import * as ReactSwitch from "react-switch";

export default function Switch(
    props: { 
        onChange?: (v: boolean) => void, 
        checked?: boolean 
    }
): JSX.Element | null {
    const [isChecked, setChecked] = useState(props.checked ?? false);
    return (
        <ReactSwitch.default 
            onChange={(v) => {
                setChecked(v);
                props.onChange?.(v);
            }}
            checked={isChecked}
            uncheckedIcon={false}
            checkedIcon={false}
            onColor="#324a5f"
            offColor="#324a5f"
            onHandleColor="#32a852"
            offHandleColor="#a83232">
        </ReactSwitch.default>
    );
}