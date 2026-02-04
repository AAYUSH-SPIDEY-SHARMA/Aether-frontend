import { useEffect, useRef, useState } from 'react';
import './NeuralGrid.css';

/**
 * NeuralGrid - Animated neural network mesh background
 * Creates a subtle, slow-moving network of nodes and connections
 * Respects reduced-motion preferences
 */
export default function NeuralGrid({ className = '' }) {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handleChange = (e) => setPrefersReducedMotion(e.matches);
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let nodes = [];
        let width, height;

        // Configuration
        const config = {
            nodeCount: 50,
            connectionDistance: 150,
            nodeSpeed: 0.3, // Slow, elegant movement
            nodeSize: 2,
            lineWidth: 0.5,
            colors: {
                node: 'rgba(0, 240, 255, 0.6)',
                nodeGlow: 'rgba(0, 240, 255, 0.3)',
                line: 'rgba(0, 240, 255, 0.15)',
                linePurple: 'rgba(168, 85, 247, 0.1)'
            }
        };

        // Resize canvas
        const resize = () => {
            width = canvas.offsetWidth;
            height = canvas.offsetHeight;
            canvas.width = width * window.devicePixelRatio;
            canvas.height = height * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
            initNodes();
        };

        // Initialize nodes
        const initNodes = () => {
            nodes = [];
            for (let i = 0; i < config.nodeCount; i++) {
                nodes.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * config.nodeSpeed,
                    vy: (Math.random() - 0.5) * config.nodeSpeed,
                    size: Math.random() * config.nodeSize + 1,
                    pulsePhase: Math.random() * Math.PI * 2
                });
            }
        };

        // Update node positions
        const updateNodes = () => {
            nodes.forEach(node => {
                node.x += node.vx;
                node.y += node.vy;
                node.pulsePhase += 0.02;

                // Bounce off edges
                if (node.x < 0 || node.x > width) node.vx *= -1;
                if (node.y < 0 || node.y > height) node.vy *= -1;

                // Keep within bounds
                node.x = Math.max(0, Math.min(width, node.x));
                node.y = Math.max(0, Math.min(height, node.y));
            });
        };

        // Draw nodes and connections
        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            // Draw connections
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < config.connectionDistance) {
                        const opacity = 1 - (distance / config.connectionDistance);

                        // Gradient line from cyan to purple
                        const gradient = ctx.createLinearGradient(
                            nodes[i].x, nodes[i].y,
                            nodes[j].x, nodes[j].y
                        );
                        gradient.addColorStop(0, `rgba(0, 240, 255, ${opacity * 0.15})`);
                        gradient.addColorStop(1, `rgba(168, 85, 247, ${opacity * 0.1})`);

                        ctx.beginPath();
                        ctx.strokeStyle = gradient;
                        ctx.lineWidth = config.lineWidth;
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Draw nodes
            nodes.forEach(node => {
                const pulseScale = 1 + Math.sin(node.pulsePhase) * 0.3;
                const size = node.size * pulseScale;

                // Glow
                ctx.beginPath();
                ctx.fillStyle = config.colors.nodeGlow;
                ctx.arc(node.x, node.y, size * 3, 0, Math.PI * 2);
                ctx.fill();

                // Node
                ctx.beginPath();
                ctx.fillStyle = config.colors.node;
                ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
                ctx.fill();
            });
        };

        // Animation loop
        const animate = () => {
            if (!prefersReducedMotion) {
                updateNodes();
            }
            draw();
            animationRef.current = requestAnimationFrame(animate);
        };

        // Initialize
        resize();
        animate();

        window.addEventListener('resize', resize);

        return () => {
            window.removeEventListener('resize', resize);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [prefersReducedMotion]);

    return (
        <div className={`neural-grid ${className}`}>
            <canvas ref={canvasRef} className="neural-canvas" />
        </div>
    );
}
