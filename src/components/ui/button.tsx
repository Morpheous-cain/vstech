"use client";
/**
 * Button — shadcn/ui style, VisionTech indigo theme.
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default:     "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo",
        secondary:   "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200",
        outline:     "border border-indigo-300 text-indigo-600 hover:bg-indigo-50",
        ghost:       "text-indigo-600 hover:bg-indigo-50",
        destructive: "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100",
        white:       "bg-white text-indigo-700 border border-gray-200 hover:border-indigo-300 shadow-card",
      },
      size: {
        sm:   "h-8 px-3 text-xs rounded-lg",
        md:   "h-10 px-4",
        lg:   "h-12 px-6 text-base",
        icon: "h-9 w-9 rounded-lg",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
