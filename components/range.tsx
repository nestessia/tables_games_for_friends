"use client";

import { useState, useEffect } from "react";

export type RangeProps = {
    min?: number;
    max?: number;
    step?: number;
    value?: number;
    onChange: (value: number) => void;
    className?: string;
};

export default function Range({
    min = 0,
    max = 100,
    step = 1,
    value,
    onChange,
    className = "",
}: RangeProps) {
    const [current, setCurrent] = useState<number>(value ?? min);

    useEffect(() => {
        if (value === undefined) onChange(min);
    }, []);

    useEffect(() => {
        if (value !== undefined) setCurrent(value);
    }, [value]);

    const percent = ((current - min) / (max - min)) * 100;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const next = Number(e.target.value);
        setCurrent(next);
        onChange(next);
    };

    return (
        <div className={`w-full flex flex-col gap-2 ${className}`}>
            <div className="relative w-full h-2">
                <div className="absolute inset-0 rounded-full bg-[rgba(140,100,255,0.18)] border border-[rgba(140,100,255,0.15)]" />
                <div
                    className="absolute inset-y-0 left-0 rounded-full bg-[rgba(107,65,231,0.85)]"
                    style={{ width: `${percent}%` }}
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={current}
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    style={{ margin: 0 }}
                />
                <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#8b6bef] border-2 border-[rgba(140,100,255,0.6)] shadow-[0_0_8px_rgba(107,65,231,0.6)] pointer-events-none transition-left duration-75"
                    style={{ left: `calc(${percent}% - 8px)` }}
                />
            </div>
            <div className="flex justify-between text-xs text-accent-muted select-none">
                <span>{min}</span>
                <span>{max}</span>
            </div>
        </div>
    );
}
