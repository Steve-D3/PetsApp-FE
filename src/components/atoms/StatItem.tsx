interface StatItemProps {
  label: string;
  value: React.ReactNode;
  isWarning?: boolean;
  className?: string;
}

export const StatItem = ({
  label,
  value,
  isWarning = false,
  className = ''
}: StatItemProps) => (
  <div className={`flex justify-between text-sm ${className}`}>
    <span className="text-gray-500">{label}</span>
    <span className={`font-medium ${isWarning ? 'text-red-500' : ''}`}>
      {value}
    </span>
  </div>
);
