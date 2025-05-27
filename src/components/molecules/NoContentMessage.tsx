import type { ReactNode } from "react";
import { Button } from "@/components/atoms/Button";

interface NoContentMessageProps {
  icon: ReactNode;
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const NoContentMessage = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  className = "",
}: NoContentMessageProps) => (
  <div className={`text-center py-8 text-gray-500 ${className}`}>
    <div className="mb-2">{icon}</div>
    <p className="text-gray-700 mb-2">{title}</p>
    {description && <p className="text-sm mb-4">{description}</p>}
    {actionText && onAction && (
      <Button onClick={onAction} className="mt-2">
        {actionText}
      </Button>
    )}
  </div>
);
