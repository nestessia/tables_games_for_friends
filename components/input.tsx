"use client";

import { useState, useEffect } from "react";
export type InputVariant = "primary" | "secondary";
export type InputSize = "sm" | "md" | "lg";

export type InputProps = {
    placeholder?: string;
    className?: string;
    variant?: InputVariant;
    size?: InputSize;
    type?: "text" | "number";
    disabled?: boolean;
    min?: number;
    max?: number;
    step?: number;
    value?: string;
    onChange: (value: string) => void;
}

const variantClasses: Record<InputVariant, string> = {
    primary: [
        "bg-[rgba(30,30,46,0.9)] text-accent-light",
        "border border-[rgba(140,100,255,0.4)]",
        "placeholder:text-[rgba(184,159,255,0.4)]",
        "focus:border-[rgba(140,100,255,0.75)] focus:shadow-[0_0_0_3px_rgba(100,60,220,0.25)]",
        "hover:border-[rgba(140,100,255,0.6)]",
    ].join(" "),
    secondary: [
        "bg-[rgba(140,100,255,0.08)] text-[#b89fff]",
        "border border-[rgba(140,100,255,0.25)]",
        "placeholder:text-[rgba(184,159,255,0.3)]",
        "focus:border-[rgba(140,100,255,0.55)] focus:shadow-[0_0_0_3px_rgba(100,60,220,0.15)]",
        "hover:border-[rgba(140,100,255,0.4)]",
    ].join(" "),
};

const sizeClasses: Record<InputSize, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-5 py-3.5 text-lg",
};


export default function Input({
    placeholder,
    className = "",
    variant = "primary",
    size = "md",
    type = "text",
    disabled = false,
    min,
    max,
    step,
    value,
    onChange,
}: InputProps) {
    const [inputValue, setInputValue] = useState<string>(value ?? "");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (value !== undefined) setInputValue(value);
    }, [value]);

    return (
        <div className="flex flex-col w-full">
            <input
                type={type}
                className={`${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
                placeholder={placeholder}
                value={inputValue}
                min={min}
                max={max}
                step={step}
                disabled={disabled}
                onChange={(e) => {
                    setInputValue(e.target.value);
                    if (type === "text") {
                        onChange(e.target.value);
                    }
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        if (inputValue === "") {
                            setError("Введите значение");
                        } else if (type === "number" && min !== undefined && Number(inputValue) < min) {
                            setError(`Минимальное значение: ${min}`);
                        } else {
                            setError(null);
                            onChange(inputValue);
                        }
                    }
                }}
            />
            {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
        </div>
    );
}
