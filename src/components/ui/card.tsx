import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Base Card
 */
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

/* =========================================================
   ✅ REQUIRED VARIANTS (USED ACROSS YOUR APP)
========================================================= */

export function GoldTopCard({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative bg-white rounded-2xl border border-yellow-400/30 shadow-card overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500" />
      <div className="p-6">{children}</div>
    </div>
  );
}

export function DarkNavyCard({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-[#0b1220] text-white rounded-2xl border border-blue-900/40 shadow-md",
        className
      )}
      {...props}
    >
      <div className="p-6">{children}</div>
    </div>
  );
}

export function OutlinedCard({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-transparent border border-gray-300 rounded-2xl shadow-none",
        className
      )}
      {...props}
    >
      <div className="p-6">{children}</div>
    </div>
  );
}

/* =========================================================
   EXISTING VARIANTS (KEEPING YOUR ORIGINALS)
========================================================= */

export function CardIndigoTop({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative bg-white rounded-2xl border border-indigo-100 shadow-card overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-indigo-400" />
      <div className="p-6">{children}</div>
    </div>
  );
}

export function CardDeep({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-indigo-900 rounded-2xl border border-indigo-700/50 text-white",
        className
      )}
      {...props}
    >
      <div className="p-6">{children}</div>
    </div>
  );
}