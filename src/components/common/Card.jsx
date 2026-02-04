import './Card.css';

export default function Card({
    children,
    variant = 'default',
    className = '',
    hover = true,
    padding = 'md',
    ...props
}) {
    const classes = [
        'card',
        variant !== 'default' && `card-${variant}`,
        !hover && 'card-no-hover',
        `card-padding-${padding}`,
        className,
    ].filter(Boolean).join(' ');

    return (
        <div className={classes} {...props}>
            {children}
        </div>
    );
}
