import * as React from "react";
import { cn } from "@/lib/utils";

export function Separator({ className, orientation = "horizontal", ...props }: React.HTMLAttributes<HTMLDivElement> & { orientation?: "horizontal" | "vertical" }) {
  return (
    <div
      className={cn(
        "bg-gray-100",
        orientation === "horizontal" ? "h-px w-full" : "w-px h-full",
        className
      )}
      {...props}
    />
  );
}
