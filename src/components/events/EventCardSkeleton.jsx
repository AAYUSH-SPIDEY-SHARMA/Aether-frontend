// Event Card Skeleton - Loading shimmer effect
import { motion } from 'framer-motion';
import './EventCardSkeleton.css';

export default function EventCardSkeleton({ index = 0 }) {
    return (
        <motion.div
            className="event-skeleton"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
        >
            <div className="event-skeleton__content">
                {/* Badges */}
                <div className="event-skeleton__badges">
                    <div className="skeleton-badge" />
                    <div className="skeleton-badge skeleton-badge--sm" />
                </div>

                {/* Title */}
                <div className="skeleton-title" />

                {/* Divider */}
                <div className="skeleton-divider" />

                {/* Description */}
                <div className="skeleton-desc">
                    <div className="skeleton-line" />
                    <div className="skeleton-line skeleton-line--short" />
                </div>

                {/* Meta */}
                <div className="skeleton-meta">
                    <div className="skeleton-meta-item" />
                    <div className="skeleton-meta-item" />
                    <div className="skeleton-meta-item skeleton-meta-item--sm" />
                </div>

                {/* CTA */}
                <div className="skeleton-cta">
                    <div className="skeleton-btn" />
                    <div className="skeleton-btn skeleton-btn--primary" />
                </div>
            </div>

            {/* Shimmer overlay */}
            <div className="event-skeleton__shimmer" />
        </motion.div>
    );
}

// Export Grid Skeleton for multiple loading cards
export function EventCardSkeletonGrid({ count = 4 }) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <EventCardSkeleton key={i} index={i} />
            ))}
        </>
    );
}
