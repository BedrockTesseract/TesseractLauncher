import Button from './Button';

interface CheckboxProps {
    value?: boolean;
    onChange?: (value: boolean) => void;
    handleStyle?: React.CSSProperties;
}

export default function Checkbox(props: React.ComponentProps<'div'> & CheckboxProps): JSX.Element {
    const {style, handleStyle, children, onClick, onChange, value, ...rest} = props;
    const fullStyle = {
        width: '20px',
        height: '20px',
        borderRadius: '5px',
        backgroundColor: 'var(--charcoal)',
        border: '2px solid var(--rich-black)',
        ...style
    }

    const handleFullStyle = {
        width: '50%',
        height: '50%',
        borderRadius: '2.5px',
        backgroundColor: 'var(--oxford-blue)',
        display: value ? 'block' : 'none',
        ...handleStyle
    }

    return (
        <Button style={fullStyle} onClick={(e) => {
            onClick?.(e);
            onChange?.(!props.value);
        }} {...rest}>
            <div style={handleFullStyle}>
                {children}
            </div>
        </Button>
    );
}