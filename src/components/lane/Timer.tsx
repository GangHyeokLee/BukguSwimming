import { useEffect, useState } from "react";
import NumDial from "./NumDial";

interface TimerProps {
    setTime: React.Dispatch<React.SetStateAction<number>>;
}

export const Timer = ({ setTime }: TimerProps) => {
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [milliseconds, setMilliseconds] = useState(0);

    useEffect(() => {
        setTime((minutes * 60 * 1000) + (seconds * 1000) + milliseconds);
    }, [minutes, seconds, milliseconds, setTime]);

    return (
        <div className="flex w-full items-center gap-1 justify-center border border-gray-200 rounded-lg">
            <NumDial maxNum={60} dialNum={minutes} setDialNum={setMinutes} />
            <div className="text-3xl font-bold">&apos;</div>
            <NumDial maxNum={60} dialNum={seconds} setDialNum={setSeconds} />
            <div className="text-3xl font-bold">&apos;&apos;</div>
            <NumDial maxNum={1000} dialNum={milliseconds} setDialNum={setMilliseconds} />
        </div>
    );
};