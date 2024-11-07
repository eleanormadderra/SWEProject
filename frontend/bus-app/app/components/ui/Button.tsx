import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost";
    size?: "small" | "medium" | "large";
    onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
    variant = "primary",
    size = "medium",
    onClick,
    children,
    className = "",
    ...props
}) => {
    const baseStyles = "rounded-lg font-semibold focus:outline-none transition-all duration-200";
    const variantStyles = {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "bg-gray-500 text-white hover:bg-gray-600",
        ghost: "bg-transparent text-gray-500 hover:bg-gray-200",
    };
    const sizeStyles = {
        small: "px-3 py-1 text-sm",
        medium: "px-4 py-2 text-base",
        large: "px-5 py-3 text-lg",
    };

    return (
        <button
            onClick={onClick}
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
