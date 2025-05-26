import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import type { TimelineItemProps } from "@/lib/types/types.d";

export const TimelineItem = forwardRef<HTMLDivElement, TimelineItemProps>(
  ({ className, date, title, subtitle, icon, actionIcon, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "group flex items-center gap-4 px-0 py-3 justify-between border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors",
          className
        )}
        {...props}
      >
        <div className="flex items-start gap-3 w-full">
          <div className="flex items-center justify-center rounded-lg bg-gray-50 p-2 shrink-0">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-900 text-sm font-medium leading-tight truncate">
              {title}
            </p>
            <p className="text-gray-500 text-xs leading-tight mt-0.5 truncate">
              {subtitle}
            </p>
            <p className="text-gray-400 text-xs mt-1">
              {date}
            </p>
          </div>
          {actionIcon && (
            <div className="shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100">
                {actionIcon}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

TimelineItem.displayName = "TimelineItem";
