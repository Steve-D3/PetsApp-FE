import { ChevronRight } from "lucide-react";
import { Text } from "../atoms/Text";

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
      className="flex items-center justify-between p-4 bg-white rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <div className="flex items-center gap-4">
        {icon && <div className="p-2 bg-gray-100 rounded-lg">{icon}</div>}
        <div>
          <Text variant="body" className="font-medium">
            {title}
          </Text>
          <Text variant="caption">{subtitle}</Text>
        </div>
      </div>
      <ChevronRight className="text-gray-400" />
    </div>
  );
};
