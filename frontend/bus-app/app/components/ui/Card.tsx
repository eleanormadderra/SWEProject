import * as React from "react";

/**
 * `Card` is a React functional component that renders a styled `div` element.
 * It uses `React.forwardRef` to pass a ref to the `div` element.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} [props.className] - Additional class names to apply to the `div` element.
 * @param {React.Ref<HTMLDivElement>} ref - The ref to be forwarded to the `div` element.
 * @returns {JSX.Element} A styled `div` element with the provided props and class names.
 */
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className || ""}`}
            {...props}
        />
    )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={`flex flex-col space-y-1.5 p-6 ${className || ""}`}
            {...props}
        />
    )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
        <h3
            ref={ref}
            className={`text-2xl font-semibold leading-none tracking-tight ${className || ""}`}
            {...props}
        />
    )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <p
            ref={ref}
            className={`text-sm text-muted-foreground ${className || ""}`}
            {...props}
        />
    )
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={`p-6 pt-0 ${className || ""}`} {...props} />
    )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={`flex items-center p-6 pt-0 ${className || ""}`}
            {...props}
        />
    )
);
CardFooter.displayName = "CardFooter";

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
