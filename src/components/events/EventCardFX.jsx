// Event Card FX - Hover Effects and 3D Tilt Logic
import { useState, useRef, useCallback } from 'react';

// Custom hook for 3D tilt effect based on cursor position
export function useTiltEffect(options = {}) {
    const { maxTilt = 8, scale = 1.02, speed = 400 } = options;
    const ref = useRef(null);
    const [style, setStyle] = useState({
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
        transition: `transform ${speed}ms ease-out`,
    });

    const handleMouseMove = useCallback((e) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate mouse position relative to center (-1 to 1)
        const mouseX = (e.clientX - centerX) / (rect.width / 2);
        const mouseY = (e.clientY - centerY) / (rect.height / 2);

        // Calculate rotation (inverted for natural feel)
        const rotateX = mouseY * -maxTilt;
        const rotateY = mouseX * maxTilt;

        setStyle({
            transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
            transition: 'transform 100ms ease-out',
        });
    }, [maxTilt, scale]);

    const handleMouseLeave = useCallback(() => {
        setStyle({
            transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
            transition: `transform ${speed}ms ease-out`,
        });
    }, [speed]);

    return { ref, style, handleMouseMove, handleMouseLeave };
}

// Magnetic button effect
export function useMagneticEffect(strength = 0.3) {
    const ref = useRef(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const handleMouseMove = useCallback((e) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distX = (e.clientX - centerX) * strength;
        const distY = (e.clientY - centerY) * strength;

        setOffset({ x: distX, y: distY });
    }, [strength]);

    const handleMouseLeave = useCallback(() => {
        setOffset({ x: 0, y: 0 });
    }, []);

    const style = {
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: offset.x === 0 ? 'transform 300ms ease-out' : 'transform 50ms ease-out',
    };

    return { ref, style, handleMouseMove, handleMouseLeave };
}

// Glow position tracking
export function useGlowEffect() {
    const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });
    const ref = useRef(null);

    const handleMouseMove = useCallback((e) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        setGlowPosition({ x, y });
    }, []);

    return { ref, glowPosition, handleMouseMove };
}

export default { useTiltEffect, useMagneticEffect, useGlowEffect };
