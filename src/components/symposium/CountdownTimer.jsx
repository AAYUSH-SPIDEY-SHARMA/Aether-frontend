import useCountdown from '../../hooks/useCountdown';
import './CountdownTimer.css';

export default function CountdownTimer({ targetDate }) {
    const { days, hours, minutes, seconds, isExpired } = useCountdown(targetDate);

    if (isExpired) {
        return (
            <div className="countdown expired">
                <span className="countdown-message">🎉 Event is Live!</span>
            </div>
        );
    }

    const timeUnits = [
        { value: days, label: 'Days' },
        { value: hours, label: 'Hours' },
        { value: minutes, label: 'Mins' },
        { value: seconds, label: 'Secs' },
    ];

    return (
        <div className="countdown">
            {timeUnits.map((unit, index) => (
                <div key={unit.label} className="countdown-item">
                    <div className="countdown-value">
                        <span className="countdown-number">
                            {String(unit.value).padStart(2, '0')}
                        </span>
                    </div>
                    <span className="countdown-label">{unit.label}</span>
                    {index < timeUnits.length - 1 && (
                        <span className="countdown-separator">:</span>
                    )}
                </div>
            ))}
        </div>
    );
}
