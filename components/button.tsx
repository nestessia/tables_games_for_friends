"use client";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = {
    text: string;
    className?: string;
    variant?: ButtonVariant;
    size?: ButtonSize;
    onClick?: () => void;
    disabled?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
    primary: [
        "bg-[rgba(107,65,231,0.85)] text-white",
        "border border-[rgba(140,100,255,0.5)]",
        "hover:bg-[rgba(120,80,245,0.95)] hover:shadow-[0_4px_20px_rgba(100,60,220,0.45)]",
        "active:bg-[rgba(107,65,231,0.75)]",
    ].join(" "),
    secondary: [
        "bg-[rgba(140,100,255,0.18)] text-[#b89fff]",
        "border border-[rgba(140,100,255,0.35)]",
        "hover:bg-[rgba(140,100,255,0.32)] hover:border-[rgba(140,100,255,0.55)]",
        "active:opacity-80",
    ].join(" "),
    outline: [
        "bg-transparent text-[#b89fff]",
        "border border-[rgba(140,100,255,0.4)]",
        "hover:bg-[rgba(140,100,255,0.1)] hover:border-[rgba(140,100,255,0.6)]",
        "active:opacity-80",
    ].join(" "),
    ghost: [
        "bg-transparent text-[rgba(220,220,240,0.65)]",
        "hover:bg-[rgba(140,100,255,0.12)] hover:text-[#b89fff]",
        "active:opacity-80",
    ].join(" "),
};

const sizeClasses: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-7 py-3.5 text-lg",
};

export default function Button({
    text,
    className = "",
    variant = "primary",
    size = "md",
    onClick,
    disabled = false,
}: ButtonProps) {
    return (
        <button
            disabled={disabled}
            className={[
                "inline-flex items-center justify-center rounded-lg font-semibold",
                "transition-all duration-[250ms] ease-[ease] cursor-pointer",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                variantClasses[variant],
                sizeClasses[size],
                className,
            ].join(" ")}
            onClick={onClick}
        >
            {text}
        </button>
    );
}