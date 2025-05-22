import { cn } from "@/lib/utils";
import React from "react";

type TextProps = {
  variant?: "h1" | "h2" | "h3" | "body" | "caption";
  children: React.ReactNode;
  className?: string;
};

export const Text = ({ variant = "body", children, className }: TextProps) => {
  const baseStyles = {
    h1: "text-2xl md:text-3xl font-bold",
    h2: "text-xl md:text-2xl font-bold",
    h3: "text-lg md:text-xl font-semibold",
    body: "text-base",
    caption: "text-sm text-gray-600",
  };

  const Component = variant.startsWith("h") ? variant : "p";

  return (
    <Component className={cn(baseStyles[variant], className)}>
      {children}
    </Component>
  );
};
