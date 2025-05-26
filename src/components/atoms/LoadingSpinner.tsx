import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  className?: string;
  size?: number;
}

export const LoadingSpinner = ({
  className = "",
  size = 8,
}: LoadingSpinnerProps) => (
  <div className={`flex items-center justify-center ${className}`}>
    <Loader2 className={`h-${size} w-${size} animate-spin text-blue-500`} />
  </div>
);
