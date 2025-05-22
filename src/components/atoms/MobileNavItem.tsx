import { cn } from "@/lib/utils";
import type { MobileNavItemProps } from "@/lib/types/types.d";

export const MobileNavItem = ({
  icon,
  label,
  onClick,
  className = "",
}: MobileNavItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-3",
      "text-gray-700 hover:bg-gray-100",
      className
    )}
  >
    <span className="text-gray-500">{icon}</span>
    <span>{label}</span>
  </button>
);
