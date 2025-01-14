import "./styles/InputBox.css"
import React from "react"

interface InputBoxProps {

}

export default function InputBox(props: React.ComponentProps<'input'> & InputBoxProps): JSX.Element {
    return (
        <input type="text" className="input-box" {...props}>
        </input>
    )
}