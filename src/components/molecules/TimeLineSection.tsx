// src/components/molecules/TimelineSection.tsx
import { TimelineItem } from "../atoms/TimeLineItem";
import { SectionHeader } from "../atoms/SectionHeader";
import type { TimelineItem as TimelineItemType } from "@/lib/types/types.d";

interface TimelineSectionProps {
  title: string;
  items: TimelineItemType[];
  className?: string;
}

export const TimelineSection = ({
  title,
  items,
  className,
}: TimelineSectionProps) => {
  return (
    <div className={className}>
      <SectionHeader title={title} />
      <div className="space-y-1">
        {items.map((item) => (
          <TimelineItem key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
};
