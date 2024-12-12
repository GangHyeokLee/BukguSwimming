import React, {useEffect, useRef, useState, useCallback} from "react";

const TimerDial: React.FC = () => {
    const [minutes, setMinutes] = useState<number>(0);
    const [seconds, setSeconds] = useState<number>(0);

    const minutesDialRef = useRef<HTMLDivElement | null>(null);
    const secondsDialRef = useRef<HTMLDivElement | null>(null);

    const [startY, setStartY] = useState<number | null>(null); // 터치 시작 위치 추적

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

        document.addEventListener("touchmove", preventScroll, {passive: false});

        return () => {
            document.removeEventListener("touchmove", preventScroll);
        };
    }, []);

    const handleTouchStart = (e: React.TouchEvent) => {
        // 터치가 시작될 때의 Y 위치 저장
        setStartY(e.touches[0].clientY);
    };

    const handleTouchMove = useCallback(
        (e: React.TouchEvent, type: "minutes" | "seconds") => {
            if (startY === null) return; // 터치 시작 위치가 없으면 리턴

            const dialRef = type === "minutes" ? minutesDialRef : secondsDialRef;

            if (dialRef.current) {
                const touchY = e.touches[0].clientY;
                const delta = startY - touchY; // 터치 시작 위치 기준으로 이동량 계산

                // 임계값 설정: 너무 작은 움직임에는 반응하지 않음
                const threshold = 10; // 최소 움직임이 5px 이상이어야 반응

                if (Math.abs(delta) > threshold) {
                    // delta가 양수이면 +1, 음수이면 -1
                    const step = delta > 0 ? 1 : -1;

                    if (type === "minutes") {
                        setMinutes((prev) => {
                            const newValue = prev + step;
                            return newValue < 0 ? 999 : newValue > 999 ? 0 : newValue;
                        });
                    } else {
                        setSeconds((prev) => {
                            const newValue = prev + step;
                            return newValue < 0 ? 99 : newValue > 99 ? 0 : newValue;
                        });
                    }

                    // 터치 시작 위치를 현재 위치로 갱신하여 연속적으로 계산되도록 함
                    setStartY(touchY);
                }
            }
        },
        [startY] // startY가 변경될 때마다 이 함수가 갱신됨
    );

    // 분과 초의 위/아래 값 계산 (순환 처리)
    const getNextMinute = (value: number) => (value + 1) % 1000;
    const getPrevMinute = (value: number) => (value - 1 + 1000) % 1000;

    const getNextSecond = (value: number) => (value + 1) % 100;
    const getPrevSecond = (value: number) => (value - 1 + 100) % 100;

    // 두 자릿수 숫자 만들기 (0을 추가)
    const formatTime = (value: number) => value.toString().padStart(2, "0");

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="flex space-x-8 items-center border border-gray-200 rounded-lg">
                {/* 분 다이얼 */}
                <div
                    className="relative flex flex-col items-center py-3 px-10 gap-y-3"
                    ref={minutesDialRef}
                    onTouchStart={handleTouchStart} // 터치 시작 위치 기록
                    onTouchMove={(e) => handleTouchMove(e, "minutes")}
                >
                    <div
                        className="text-3xl font-bold text-gray-300">{String(getPrevMinute(minutes)).padStart(3, "0")}</div>
                    <input className="text-3xl font-bold text-center"
                           style={{width: `${String(minutes).length + 1}ch`}}
                           value={String(minutes).padStart(3, "0")} type="number"
                           onChange={(e) => setMinutes(Number(e.target.value)%1000)}/>
                    <div
                        className="text-3xl font-bold text-gray-300">{String(getNextMinute(minutes)).padStart(3, "0")}</div>
                </div>

                <div className="text-3xl font-bold">:</div>

                {/* 초 다이얼 */}
                <div
                    className="relative flex flex-col items-center py-3 px-10 gap-y-3"
                    ref={secondsDialRef}
                    onTouchStart={handleTouchStart} // 터치 시작 위치 기록
                    onTouchMove={(e) => handleTouchMove(e, "seconds")}
                >
                    <div className="text-3xl font-bold text-gray-300">{formatTime(getPrevSecond(seconds))}</div>
                    <input className="text-3xl font-bold text-center" style={{width: `${String(seconds).length + 1}ch`}}
                           value={formatTime(seconds)} type="number"
                           onChange={(e) => setSeconds(Number(e.target.value)%100)}/>
                    <div className="text-3xl font-bold text-gray-300">{formatTime(getNextSecond(seconds))}</div>
                </div>
            </div>
        </div>
    );
};

export default TimerDial;
