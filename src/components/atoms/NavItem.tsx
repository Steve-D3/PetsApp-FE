// src/components/atoms/NavItem.tsx
import { cn } from "@/lib/utils";

type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
};

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
