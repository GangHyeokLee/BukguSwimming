import {useState, useRef} from "react";

// 타입 선언
const TimePicker: React.FC = () => {
    const [seconds, setSeconds] = useState<number>(0); // 초 단위 (0 ~ 60)
    const [fraction, setFraction] = useState<number>(0); // 초의 분수 (0 ~ 99)
    const touchStartY = useRef<number>(0); // 터치 시작 위치

    // 터치 시작 시 Y 위치 저장
    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        touchStartY.current = e.touches[0].clientY;
    };

    // 터치 이동 시 스크롤 처리
    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        const touchEndY = e.touches[0].clientY; // 터치 끝 위치
        const deltaY = touchStartY.current - touchEndY;

        const target = e.target as HTMLDivElement; // e.target을 HTMLDivElement로 타입 단언


        // 초 단위 스크롤
        if (target.classList.contains("seconds")) {
            setSeconds((prev) => {
                const newSeconds = prev + (deltaY < 0 ? 1 : -1);
                return Math.max(0, Math.min(60, newSeconds)); // 0~60 범위로 제한
            });
        }
        // 초의 분수 단위 스크롤
        if (target.classList.contains("fraction")) {
            setFraction((prev) => {
                const newFraction = prev + (deltaY < 0 ? 1 : -1);
                return Math.max(0, Math.min(99, newFraction)); // 0~99 범위로 제한
            });
        }

        touchStartY.current = touchEndY; // 터치 끝 위치를 새로 설정
    };

    return (
        <div className="time-picker flex flex-col items-center">
            <div className="time-display text-3xl font-bold">
                <span>{seconds < 10 ? "0" + seconds : seconds}</span>:
                <span>{fraction < 10 ? "0" + fraction : fraction}</span>
            </div>

            <div className="flex gap-5">

                {/* 초 입력 */}
                <div
                    className="seconds time-selector"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    style={{marginTop: "20px", cursor: "pointer"}}
                >
                    <div className="label">초</div>
                    <div className="number-display">
                        <div className="number prev">{seconds === 0 ? 60 : seconds - 1}</div>
                        <div className="number current">{seconds}</div>
                        <div className="number next">{seconds === 59 ? 0 : seconds + 1}</div>
                    </div>
                </div>

                {/* 초의 분수 입력 */}
                <div
                    className="fraction time-selector"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    style={{marginTop: "20px", cursor: "pointer"}}
                >
                    <div className="label">초의 분수</div>
                    <div className="number-display">
                        <div className="number prev">{fraction === 0 ? 99 : fraction - 1}</div>
                        <div className="number current">{fraction}</div>
                        <div className="number next">{fraction === 99 ? 0 : fraction + 1}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimePicker;
