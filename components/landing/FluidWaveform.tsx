"use client";

import React, { useEffect, useRef } from "react";

const FluidWaveform: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let width: number;
        let height: number;

        const themeRgb = "255, 107, 0"; 

        const resizeCanvas = () => {
            if (!canvas.parentElement) return;
            width = canvas.parentElement.clientWidth;
            height = canvas.parentElement.clientHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        const drawFullWaves = (time: number) => {
            const linesCount = 70; 
            const spacing = height / linesCount;

            ctx.lineWidth = 1.5;
            
            for (let i = 0; i <= linesCount; i++) {
                ctx.beginPath();
                let baseY = spacing * i;
                
                for (let x = 0; x <= width; x += 10) {
                    let wave1 = Math.sin(x * 0.002 + time * 0.7 + i * 0.1);
                    let wave2 = Math.cos(x * 0.004 - time * 0.4 + i * 0.05);
                    let wave3 = Math.sin(x * 0.001 + time * 0.2);

                    let amplitude = 50 + Math.sin(i * 0.1 + time * 0.5) * 25;
                    let distanceFromCenterY = Math.abs(baseY - height / 2) / (height / 2);
                    let centerFocus = 1 - (distanceFromCenterY * 0.4); 
                    
                    let y = baseY + ((wave1 + wave2 * 0.5 + wave3 * 0.5) * amplitude * centerFocus);

                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }

                let alpha = 0.2 + Math.sin(time + i * 0.1) * 0.1;
                ctx.strokeStyle = `rgba(${themeRgb}, ${alpha})`;
                ctx.stroke();
            }
        };

        const animate = (currentTime: number) => {
            ctx.fillStyle = "#020202";
            ctx.fillRect(0, 0, width, height);
            drawFullWaves(currentTime * 0.001);
            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="absolute inset-0 z-0 pointer-events-none">
            <canvas
                ref={canvasRef}
                className="block w-full h-full"
            />
        </div>
    );
};

export default FluidWaveform;
