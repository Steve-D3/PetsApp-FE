// src/components/atoms/NavItem.tsx
import { cn } from "@/lib/utils";
import type { NavItemProps } from "@/lib/types/types.d";

export const NavItem = ({
  icon,
  label,
  onClick,
  className = "",
}: NavItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors",
      "flex items-center justify-center",
      "relative group",
      "active:ring-gray-600 active:ring-offset-2 active:ring focus:ring-gray-600 focus:ring-offset-2 focus:ring",
      className
    )}
    aria-label={label}
  >
    {icon}
    <span className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
      {label}
    </span>
  </button>
);
