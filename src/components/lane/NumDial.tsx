"use client"
import React, { useCallback, useEffect, useRef, useState } from "react";

interface NumDialProps {
    maxNum: number;
}

export const NumDial = ({ maxNum }: NumDialProps) => {
    const [dialNum, setDialNum] = useState(0);

    // touch start position Y
    const [startY, setStartY] = useState<number | null>(null); // Change to null instead of -1

    // state for calculate time
    const [touchStartTime, setTouchStartTime] = useState<number | null>(null);

    const dialRef = useRef<HTMLDivElement | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        setStartY(e.touches[0].clientY);
        setTouchStartTime(Date.now());
    }, []);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (startY === null) return;

        if (dialRef.current) {
            const touchY = e.touches[0].clientY;
            const delta = startY - touchY;

            const threshold = 10;

            if (Math.abs(delta) > threshold) {
                const step = delta > 0 ? 1 : -1;
                setDialNum((prev) => (prev + step + maxNum) % maxNum);
                setStartY(touchY);
            }
        }
    }, [maxNum, startY]);

    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
        if (touchStartTime && startY) {
            const duration = (Date.now() - touchStartTime) / 1000;
            const deltaY = startY - e.changedTouches[0].clientY;
            let velocity = deltaY / duration;

            // threshold를 상수로 분리하여 의도를 명확히 함
            const VELOCITY_THRESHOLD = 10;

            const animate = () => {
                const step = Math.round(velocity / VELOCITY_THRESHOLD);

                // 속도가 임계값 이하면 애니메이션 중단
                if (Math.abs(step) < 1) {
                    cancelAnimationFrame(animationFrameRef.current!);
                    animationFrameRef.current = null;
                    return;
                }

                // step만큼 숫자 변경
                setDialNum((prev) => (prev + step + maxNum) % maxNum);

                // 감속
                velocity *= 0.9;

                animationFrameRef.current = requestAnimationFrame(animate);
            };

            animationFrameRef.current = requestAnimationFrame(animate);
            setTouchStartTime(null);
            setStartY(null);
        }
    }, [maxNum, startY, touchStartTime]);

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
    )
}