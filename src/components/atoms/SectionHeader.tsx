import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface SectionHeaderProps extends React.HTMLAttributes<HTMLHeadingElement> {
  title: string;
}

export const SectionHeader = forwardRef<HTMLHeadingElement, SectionHeaderProps>(
  ({ className, title, ...props }, ref) => {
    return (
      <h2
        ref={ref}
        className={cn(
          "text-foreground text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5",
          className
        )}
        {...props}
      >
        {title}
      </h2>
    );
  }
);

SectionHeader.displayName = "SectionHeader";
