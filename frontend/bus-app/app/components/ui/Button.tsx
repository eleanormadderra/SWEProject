/**
 * Button component that supports different variants, sizes, and link functionality.
 *
 * @param {ButtonProps} props - The properties for the Button component.
 * @param {"primary" | "secondary" | "ghost" | "link"} [props.variant="primary"] - The variant of the button.
 * @param {"small" | "medium" | "large"} [props.size="medium"] - The size of the button.
 * @param {string} [props.href] - The URL for link buttons.
 * @param {() => void} [props.onClick] - The click event handler for the button.
 * @param {React.ReactNode} props.children - The content of the button.
 * @param {string} [props.className=""] - Additional class names for the button.
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement | HTMLAnchorElement>} props - Additional props for the button.
 *
 * @returns {JSX.Element} The rendered button component.
 */
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement | HTMLAnchorElement> {
  variant?: "primary" | "secondary" | "ghost" | "link"; // Add "link" variant
  size?: "small" | "medium" | "large";
  href?: string; // Add support for "href" to make link buttons
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "medium",
  href,
  onClick,
  children,
  className = "",
  ...props
}) => {
  const baseStyles =
    "rounded-lg font-semibold focus:outline-none transition-all duration-200";
  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-500 text-white hover:bg-gray-600",
    ghost: "bg-transparent text-gray-500 hover:bg-gray-200",
    link: "text-blue-500 underline hover:text-blue-700", // Add "link" styles
  };
  const sizeStyles = {
    small: "px-3 py-1 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-5 py-3 text-lg",
  };

  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  // If "href" is provided, render an <a> tag for the link variant
  if (variant === "link" && href) {
    return (
      <a href={href} className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>
        {children}
      </a>
    );
  }

  // Default to rendering a <button>
  return (
    <button onClick={onClick} className={combinedStyles} {...props}>
      {children}
    </button>
  );
};

export default Button;
