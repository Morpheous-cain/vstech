/**
 * Card — shadcn/ui compatible, VisionTech indigo/white theme.
 */
import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("bg-white rounded-2xl border border-indigo-100 shadow-card", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pb-0", className)} {...props}>{children}</div>;
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("font-display text-lg text-gray-900 font-semibold", className)} {...props}>{children}</h3>;
}

export function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-gray-500 mt-1", className)} {...props}>{children}</p>;
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6", className)} {...props}>{children}</div>;
}

export function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0 flex items-center", className)} {...props}>{children}</div>;
}

// VisionTech specific variants
export function CardIndigoTop({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("relative bg-white rounded-2xl border border-indigo-100 shadow-card overflow-hidden", className)} {...props}>
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-indigo-400" />
      <div className="p-6">{children}</div>
    </div>
  );
}

export function CardDeep({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("bg-indigo-900 rounded-2xl border border-indigo-700/50 text-white", className)} {...props}>
      <div className="p-6">{children}</div>
    </div>
  );
}
