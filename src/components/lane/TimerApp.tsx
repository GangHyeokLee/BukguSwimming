import { NumDial } from "@/components/lane/NumDial";

const TimerDial = () => {
    return (
        <div className="flex w-full items-center gap-1 justify-center border border-gray-200 rounded-lg">
            <NumDial maxNum={60} />
            <div className="text-3xl font-bold">:</div>
            <NumDial maxNum={60} />
            <div className="text-3xl font-bold">:</div>
            <NumDial maxNum={100} />
        </div>
    );
};

export default TimerDial;
