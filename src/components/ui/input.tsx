/**
 * Input — shadcn/ui style, VisionTech indigo theme.
 */
import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, ...props }, ref) => (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{leftIcon}</div>
        )}
        <input
          className={cn(
            "flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900",
            "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
            "disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200",
            leftIcon && "pl-9",
            error && "border-red-300 focus:ring-red-400",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
);
Input.displayName = "Input";

export { Input };
