import './Badge.css';

export default function Badge({
    children,
    variant = 'cyan',
    size = 'md',
    className = '',
    icon: Icon,
    ...props
}) {
    const classes = [
        'badge',
        `badge-${variant}`,
        size !== 'md' && `badge-${size}`,
        className,
    ].filter(Boolean).join(' ');

    return (
        <span className={classes} {...props}>
            {Icon && <Icon size={size === 'sm' ? 10 : 12} />}
            {children}
        </span>
    );
}
