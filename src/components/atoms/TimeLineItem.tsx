import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import type { TimelineItemProps } from "@/lib/types/types.d";

export const TimelineItem = forwardRef<HTMLDivElement, TimelineItemProps>(
  ({ className, date, title, icon, actionIcon, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-4 bg-white px-4 min-h-[72px] py-2 justify-between",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-4">
          <div className="text-foreground flex items-center justify-center rounded-lg bg-muted shrink-0 size-12">
            {icon}
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-foreground text-base font-medium leading-normal line-clamp-1">
              {date}
            </p>
            <p className="text-muted-foreground text-sm font-normal leading-normal line-clamp-2">
              {title}
            </p>
          </div>
        </div>
        {actionIcon && (
          <div className="shrink-0">
            <div className="text-foreground flex size-7 items-center justify-center">
              {actionIcon}
            </div>
          </div>
        )}
      </div>
    );
  }
);

TimelineItem.displayName = "TimelineItem";
