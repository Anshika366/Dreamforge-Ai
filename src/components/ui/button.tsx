import * as React from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glow';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    
    // Base styles
    let baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";
    
    // Variant styles
    let variantStyles = "";
    switch (variant) {
      case 'primary':
        variantStyles = "bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/20";
        break;
      case 'secondary':
        variantStyles = "bg-secondary text-white hover:bg-secondary-dark shadow-lg shadow-secondary/20";
        break;
      case 'outline':
        variantStyles = "border border-white/10 text-white hover:bg-white/5 hover:border-white/20";
        break;
      case 'ghost':
        variantStyles = "text-white/80 hover:text-white hover:bg-white/5";
        break;
      case 'glow':
        variantStyles = "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] border border-white/10";
        break;
    }

    // Size styles
    let sizeStyles = "";
    switch (size) {
      case 'sm':
        sizeStyles = "px-3 py-1.5 text-xs gap-1.5";
        break;
      case 'md':
        sizeStyles = "px-5 py-2.5 text-sm gap-2";
        break;
      case 'lg':
        sizeStyles = "px-7 py-3 text-base font-semibold gap-2.5";
        break;
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-current" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
