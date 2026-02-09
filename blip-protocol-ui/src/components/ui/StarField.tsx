import React, { useEffect, useRef } from "react";

interface Star {
    x: number;
    y: number;
    z: number;
    opacity: number;
}

export const StarField = ({
    speed = 0.5,
    density = 1000,
    className = "",
}: {
    speed?: number;
    density?: number;
    className?: string;
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const starsRef = useRef<Star[]>([]);
    const requestRef = useRef<number>();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        // Initialize stars
        const initStars = () => {
            starsRef.current = Array.from({ length: density }).map(() => ({
                x: Math.random() * canvas.width - canvas.width / 2,
                y: Math.random() * canvas.height - canvas.height / 2,
                z: Math.random() * 1000,
                opacity: Math.random(),
            }));
        };

        initStars();

        const animate = () => {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            starsRef.current.forEach((star) => {
                // Move star forward
                star.z -= speed;

                // Reset if too close
                if (star.z <= 0) {
                    star.z = 1000;
                    star.x = Math.random() * canvas.width - canvas.width / 2;
                    star.y = Math.random() * canvas.height - canvas.height / 2;
                }

                // Project 3D coordinates to 2D
                const k = 128.0 / star.z;
                const px = star.x * k + canvas.width / 2;
                const py = star.y * k + canvas.height / 2;

                if (
                    px >= 0 &&
                    px <= canvas.width &&
                    py >= 0 &&
                    py <= canvas.height
                ) {
                    const size = (1 - star.z / 1000) * 2;
                    const shade = Math.floor((1 - star.z / 1000) * 255);

                    ctx.beginPath();
                    ctx.fillStyle = `rgba(255, 255, 255, ${shade / 255})`;
                    ctx.arc(px, py, size / 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [speed, density]);

    return (
        <canvas
            ref={canvasRef}
            className={`fixed inset-0 pointer-events-none z-0 ${className}`}
            style={{ background: '#000000' }}
        />
    );
};
