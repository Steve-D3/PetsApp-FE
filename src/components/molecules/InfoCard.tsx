import { ChevronRight } from "lucide-react";
import { Text } from "../atoms/Text";
import { cn } from "@/lib/utils";

type InfoCardProps = {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
  onClick?: () => void;
};

export const InfoCard = ({ title, subtitle, icon, onClick }: InfoCardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center p-4 bg-white rounded-lg border border-gray-100",
        "transition-all hover:shadow-sm",
        onClick && "cursor-pointer hover:bg-gray-50"
      )}
    >
      {icon && <div className="p-2 bg-gray-50 rounded-lg mr-4">{icon}</div>}
      <div className="flex-1 min-w-0">
        <Text variant="body" className="font-medium text-gray-900 truncate">
          {title}
        </Text>
        <Text variant="caption" className="text-gray-600 line-clamp-1">
          {subtitle}
        </Text>
      </div>
      {onClick && (
        <ChevronRight className="h-5 w-5 text-gray-400 ml-2 flex-shrink-0" />
      )}
    </div>
  );
};
