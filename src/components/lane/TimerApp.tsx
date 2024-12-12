import React, { useEffect, useRef, useState } from "react";

const TimerDial: React.FC = () => {
    const [minutes, setMinutes] = useState<number>(0);
    const [seconds, setSeconds] = useState<number>(0);

    const minutesDialRef = useRef<HTMLDivElement | null>(null);
    const secondsDialRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const preventScroll = (e: TouchEvent) => {
            const target = e.target as HTMLElement;
            if (
                minutesDialRef.current?.contains(target) ||
                secondsDialRef.current?.contains(target)
            ) {
                e.preventDefault();
            }
        };

        document.addEventListener("touchmove", preventScroll, { passive: false });

        return () => {
            document.removeEventListener("touchmove", preventScroll);
        };
    }, []);

    const handleTouchMove = (
        e: React.TouchEvent,
        type: "minutes" | "seconds"
    ) => {
        const dialRef = type === "minutes" ? minutesDialRef : secondsDialRef;

        if (dialRef.current) {
            const boundingRect = dialRef.current.getBoundingClientRect();
            const centerY = boundingRect.top + boundingRect.height / 2;

            const touchY = e.touches[0].clientY;
            const delta = centerY - touchY;
            const step = Math.round(delta / 100);

            if (type === "minutes") {
                setMinutes((prev) => {
                    const newValue = prev + step;
                    return newValue < 0 ? 59 : newValue > 59 ? 0 : newValue;
                });
            } else {
                setSeconds((prev) => {
                    const newValue = prev + step;
                    return newValue < 0 ? 99 : newValue > 99 ? 0 : newValue;
                });
            }
        }
    };

    // 분과 초의 위/아래 값 계산 (순환 처리)
    const getNextMinute = (value: number) => (value + 1) % 60;
    const getPrevMinute = (value: number) => (value - 1 + 60) % 60;

    const getNextSecond = (value: number) => (value + 1) % 100;
    const getPrevSecond = (value: number) => (value - 1 + 100) % 100;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="flex space-x-8 items-center">
                {/* 분 다이얼 */}
                <div
                    className="relative flex flex-col items-center px-10"
                    ref={minutesDialRef}
                    onTouchMove={(e) => handleTouchMove(e, "minutes")}
                >
                    <div className="text-3xl font-bold text-gray-400">{getPrevMinute(minutes)}</div>
                    <div className="text-3xl font-bold">{minutes}</div>
                    <div className="text-3xl font-bold text-gray-400">{getNextMinute(minutes)}</div>
                </div>

                <div className="text-3xl font-bold">:</div>

                {/* 초 다이얼 */}
                <div
                    className="relative flex flex-col items-center px-10"
                    ref={secondsDialRef}
                    onTouchMove={(e) => handleTouchMove(e, "seconds")}
                >
                    <div className="text-3xl font-bold text-gray-400">{getPrevSecond(seconds)}</div>
                    <div className="text-3xl font-bold">{seconds}</div>
                    <div className="text-3xl font-bold text-gray-400">{getNextSecond(seconds)}</div>
                </div>
            </div>
        </div>
    );
};

export default TimerDial;
