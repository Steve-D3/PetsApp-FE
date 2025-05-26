import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
  className?: string;
}

export const DashboardLayout = ({
  children,
  className = "",
}: DashboardLayoutProps) => {
  return (
    <div className={`flex flex-col min-h-screen bg-gray-50 ${className}`}>
      {children}
    </div>
  );
};
