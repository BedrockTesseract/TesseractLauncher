import './styles/Button.scss'
import React, { Ref, RefObject } from 'react';

interface ButtonProps {
    innerRef?: RefObject<HTMLDivElement>
};

export default function Button(props: ButtonProps & React.ComponentProps<'div'>
): JSX.Element | null {
    const {innerRef, ...rest} = props;
    return (
        <div className={'button-main'} ref={innerRef} {...rest}/>
    );
}