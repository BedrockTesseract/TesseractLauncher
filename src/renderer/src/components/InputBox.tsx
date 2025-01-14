import React from "react"
import "./InputBox.css"

interface InputBoxProps {

}

export default function InputBox(props: React.ComponentProps<'input'> & InputBoxProps): JSX.Element {
    return (
        <input type="text" className="input-box" {...props}>
        </input>
    )
}