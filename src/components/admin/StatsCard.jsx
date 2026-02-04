// StatsCard - Dashboard stats display
import { TrendingUp, TrendingDown } from 'lucide-react';
import './StatsCard.css';

export default function StatsCard({
    title,
    value,
    icon: Icon,
    trend,
    trendValue,
    color = 'cyan'
}) {
    const isPositive = trend === 'up';

    return (
        <div className={`stats-card stats-card--${color}`}>
            <div className="stats-card-header">
                <div className="stats-card-icon">
                    <Icon size={22} />
                </div>
                {trend && (
                    <div className={`stats-card-trend ${isPositive ? 'positive' : 'negative'}`}>
                        {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        <span>{trendValue}</span>
                    </div>
                )}
            </div>
            <div className="stats-card-value">{value}</div>
            <div className="stats-card-label">{title}</div>
        </div>
    );
}
