import { TimelineItem } from "../atoms/TimeLineItem";
import type { TimelineItem as TimelineItemType } from "@/lib/types/types.d";

interface TimelineSectionProps {
  title: string;
  items: TimelineItemType[];
  className?: string;
  onItemClick?: (item: TimelineItemType) => void;
}

export const TimelineSection = ({
  title,
  items,
  className,
  onItemClick,
}: TimelineSectionProps) => {
  if (items.length === 0) return null;

  return (
    <div className={className}>
      <h3 className="text-base font-semibold text-gray-900 mb-3">{title}</h3>
      <div className="divide-y divide-gray-100">
        {items.map((item) => (
          <TimelineItem
            key={item.id}
            {...item}
            onClick={() => onItemClick?.(item)}
          />
        ))}
      </div>
    </div>
  );
};
