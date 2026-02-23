"use client";

export type CheckboxProps = {
    label?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    className?: string;
}

export default function Checkbox({
    label,
    checked,
    onChange,
    disabled = false,
    className = "",
}: CheckboxProps) {
    return (
        <label className={[
            "inline-flex items-center gap-2.5 cursor-pointer select-none",
            disabled && "opacity-50 cursor-not-allowed",
            className,
        ].filter(Boolean).join(" ")}>
            <button
                type="button"
                role="checkbox"
                aria-checked={checked}
                disabled={disabled}
                onClick={(e) => { e.preventDefault(); !disabled && onChange(!checked); }}
                className={[
                    "relative h-4 w-4 shrink-0 rounded-sm",
                    "border transition-all duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(100,60,220,0.5)] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    checked
                        ? "bg-[rgba(107,65,231,0.85)] border-[rgba(140,100,255,0.7)]"
                        : "bg-transparent border-[rgba(140,100,255,0.4)] hover:border-[rgba(140,100,255,0.7)]",
                ].join(" ")}
            >
                {checked && (
                    <svg
                        viewBox="0 0 10 8"
                        fill="none"
                        stroke="white"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="absolute inset-0 m-auto w-2.5 h-2"
                    >
                        <path d="M1 4l3 3 5-6" />
                    </svg>
                )}
            </button>
            {label && (
                <span className="text-sm text-accent-light">
                    {label}
                </span>
            )}
        </label>
    );
}
