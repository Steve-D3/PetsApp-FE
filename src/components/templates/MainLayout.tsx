import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Header } from "../organisms/Header";

interface MainLayoutProps {
  showHeader?: boolean;
}

export const MainLayout = ({ showHeader = true }: MainLayoutProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header - conditionally rendered */}
      {showHeader && (
        <Header
          isMenuOpen={isMenuOpen}
          onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
          onMenuClose={() => setIsMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className={`${showHeader ? "pt-16" : ""} flex-1`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
