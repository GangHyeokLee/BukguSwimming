"use client"
import React, { useCallback, useEffect, useRef, useState } from "react";

interface NumDialProps {
    maxNum: number;
}

export const NumDial = ({ maxNum }: NumDialProps) => {
    const [dialNum, setDialNum] = useState(0);
    const [startY, setStartY] = useState<number | null>(null);
    const [touchStartTime, setTouchStartTime] = useState<number | null>(null);
    const [lastTouchY, setLastTouchY] = useState<number | null>(null);
    const [lastTouchTime, setLastTouchTime] = useState<number | null>(null);
    const [velocityHistory, setVelocityHistory] = useState<number[]>([]);
    const dialRef = useRef<HTMLDivElement | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        setStartY(e.touches[0].clientY);
        setTouchStartTime(Date.now());
        setVelocityHistory([]);
    }, []);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (startY === null) return;

        const currentTime = Date.now();
        const touchY = e.touches[0].clientY;

        if (lastTouchY !== null && lastTouchTime !== null) {
            const deltaY = lastTouchY - touchY;
            const deltaTime = (currentTime - lastTouchTime) / 1000;
            const instantVelocity = deltaY / deltaTime;

            setVelocityHistory(prev => [...prev.slice(-4), instantVelocity]);
        }

        setLastTouchY(touchY);
        setLastTouchTime(currentTime);

        if (dialRef.current) {
            const delta = startY - touchY;
            const threshold = 10;

            if (Math.abs(delta) > threshold) {
                const step = delta > 0 ? 1 : -1;
                setDialNum((prev) => (prev + step + maxNum) % maxNum);
                setStartY(touchY);
            }
        }
    }, [lastTouchTime, lastTouchY, maxNum, startY]);

    const handleTouchEnd = useCallback(() => {
        if (touchStartTime && startY && velocityHistory.length > 0) {
            const totalDuration = (Date.now() - touchStartTime) / 1000;
            const totalDistance = Math.abs(startY - lastTouchY!);
            const instantVelocity = Math.abs(velocityHistory[velocityHistory.length - 1]);

            // 빠른 스와이프 감지 (짧은 거리라도 속도가 빠르면)
            if (instantVelocity > 1000) {
                const avgVelocity = velocityHistory.reduce((a, b) => a + b, 0) / velocityHistory.length;
                let velocity = avgVelocity * 0.5; // 초기 속도 조절

                const VELOCITY_THRESHOLD = 10;
                let lastUpdateTime = Date.now();
                const UPDATE_INTERVAL = 100;

                const animate = () => {
                    const currentTime = Date.now();
                    const step = Math.round(velocity / VELOCITY_THRESHOLD);

                    if (Math.abs(step) < 1) {
                        cancelAnimationFrame(animationFrameRef.current!);
                        animationFrameRef.current = null;
                        return;
                    }

                    if (currentTime - lastUpdateTime >= UPDATE_INTERVAL) {
                        setDialNum((prev) => (prev + step + maxNum) % maxNum);
                        lastUpdateTime = currentTime;
                    }

                    velocity *= 0.9;
                    animationFrameRef.current = requestAnimationFrame(animate);
                };

                animationFrameRef.current = requestAnimationFrame(animate);
            }
            // 일반적인 짧은 터치
            else if (totalDistance < 30 && totalDuration < 0.3) {
                const direction = startY! > lastTouchY! ? 1 : -1;
                setDialNum((prev) => (prev + direction + maxNum) % maxNum);
            }
        }

        setTouchStartTime(null);
        setStartY(null);
        setLastTouchY(null);
        setLastTouchTime(null);
        setVelocityHistory([]);
    }, [maxNum, startY, touchStartTime, velocityHistory, lastTouchY]);

    useEffect(() => {
        const preventScroll = (e: TouchEvent) => {
            const target = e.target as HTMLElement;
            if (dialRef.current?.contains(target)) e.preventDefault();
        }
        document.addEventListener("touchmove", preventScroll, { passive: false });
        return () => {
            document.removeEventListener("touchmove", preventScroll);
        };
    }, []);

    const formatTime = (time: number) =>
        time.toString().padStart(
            String(maxNum - 1).length === String(maxNum).length
                ? String(maxNum).length
                : String(maxNum - 1).length,
            "0"
        );

    return (
        <div
            className="relative flex flex-col items-center py-3 px-8 gap-3"
            ref={dialRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div className="text-2xl font-bold text-gray-300">
                {formatTime((dialNum - 1 + maxNum) % maxNum)}
            </div>
            <input
                className={`text-3xl font-bold text-center`}
                style={{ width: `${maxNum.toString().length}ch` }}
                value={formatTime(dialNum)}
                type="number"
                onChange={(e) => setDialNum(Number(e.target.value) % maxNum)}
            />
            <div className="text-2xl font-bold text-gray-300">
                {formatTime((dialNum + 1) % maxNum)}
            </div>
        </div>
    );
};