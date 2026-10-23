import * as React from "react";
import { cn } from "@/lib/utilities/cn";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "emergency";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

    const variantStyles = {
      default:
        "bg-brand-teal text-white hover:bg-brand-teal-hover shadow-sm",
      destructive:
        "bg-destructive text-destructive-foreground hover:bg-red-700 shadow-sm",
      outline:
        "border border-border bg-surface hover:bg-muted text-foreground",
      secondary:
        "bg-brand-mint text-brand-teal hover:bg-teal-100 dark:bg-slate-800 dark:text-teal-300",
      ghost: "hover:bg-muted text-foreground",
      link: "text-brand-teal underline-offset-4 hover:underline",
      emergency:
        "bg-brand-emergency text-white hover:bg-red-800 shadow-sm animate-pulse-subtle",
    };

    const sizeStyles = {
      default: "h-10 px-4 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-12 rounded-xl px-6 text-base font-semibold",
      icon: "h-10 w-10",
    };

    return (
      <button
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
