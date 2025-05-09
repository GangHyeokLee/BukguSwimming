import { memo, useEffect, useRef, useState } from "react";
import NumDial from "./NumDial";

interface TimerProps {
    time: number;
    setTime: React.Dispatch<React.SetStateAction<number>>;
}
function Timer({ time, setTime }: TimerProps) {
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [milliseconds, setMilliseconds] = useState(0);
    const isInternalChange = useRef(false);

    useEffect(() => {
        if (!isInternalChange.current) {
            setMinutes(Math.floor(time / 60000));
            setSeconds(Math.floor((time % 60000) / 1000));
            setMilliseconds(time % 1000);
        }
        isInternalChange.current = false;
    }, [time]);


    useEffect(() => {
        const newTime = (minutes * 60 * 1000) + (seconds * 1000) + milliseconds;
        if (newTime !== time) {
            isInternalChange.current = true;
            setTime(newTime);
        }
    }, [minutes, seconds, milliseconds]);

    return (
        <div className="flex w-full items-center gap-1 justify-center border border-gray-200 rounded-lg">
            <NumDial maxNum={60} dialNum={minutes} setDialNum={setMinutes} />
            <div className="text-3xl font-bold">&apos;</div>
            <NumDial maxNum={60} dialNum={seconds} setDialNum={setSeconds} />
            <div className="text-3xl font-bold">.</div>
            <NumDial maxNum={1000} dialNum={milliseconds} setDialNum={setMilliseconds} />
        </div>
    );
};

export default memo(Timer);