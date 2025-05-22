// src/components/atoms/Card.tsx
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import type { CardProps } from "@/lib/types/types.d";

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "bg-white border border-gray-200 rounded-lg shadow-sm",
      outline: "border border-gray-200 rounded-lg",
    };

    return (
      <div
        ref={ref}
        className={cn("p-4 transition-colors", variants[variant], className)}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";
