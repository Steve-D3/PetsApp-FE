// src/components/templates/MainLayout.tsx
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Home, CalendarDays, User, LogOut, Settings, Menu } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useState } from "react";
import { MobileNavItem } from "../atoms/MobileNavItem";
import { NavItem } from "../atoms/NavItem";

export const MainLayout = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-900">PetsApp</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              {auth.isAuthenticated ? (
                <>
                  <NavItem
                    icon={<Home className="h-5 w-5" />}
                    label="Home"
                    onClick={() => navigate("/")}
                  />
                  <NavItem
                    icon={<CalendarDays className="h-5 w-5" />}
                    label="Appointments"
                    onClick={() => navigate("/appointments")}
                  />
                  <NavItem
                    icon={<User className="h-5 w-5" />}
                    label="Profile"
                    onClick={() => navigate("/profile")}
                  />
                  <NavItem
                    icon={<Settings className="h-5 w-5" />}
                    label="Settings"
                    onClick={() => navigate("/settings")}
                  />
                  <NavItem
                    icon={<LogOut className="h-5 w-5" />}
                    label="Logout"
                    onClick={() => auth.logout?.()}
                    className="text-red-500 hover:text-red-600"
                  />
                </>
              ) : (
                <>
                  <NavItem
                    icon={<User className="h-5 w-5" />}
                    label="Login"
                    onClick={() => navigate("/login")}
                  />
                </>
              )}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {auth.isAuthenticated ? (
                <>
                  <MobileNavItem
                    icon={<Home className="h-5 w-5" />}
                    label="Home"
                    onClick={() => {
                      navigate("/");
                      setIsMenuOpen(false);
                    }}
                  />
                  <MobileNavItem
                    icon={<CalendarDays className="h-5 w-5" />}
                    label="Appointments"
                    onClick={() => {
                      navigate("/appointments");
                      setIsMenuOpen(false);
                    }}
                  />
                  <MobileNavItem
                    icon={<User className="h-5 w-5" />}
                    label="Profile"
                    onClick={() => {
                      navigate("/profile");
                      setIsMenuOpen(false);
                    }}
                  />
                  <MobileNavItem
                    icon={<Settings className="h-5 w-5" />}
                    label="Settings"
                    onClick={() => {
                      navigate("/settings");
                      setIsMenuOpen(false);
                    }}
                  />
                  <MobileNavItem
                    icon={<LogOut className="h-5 w-5" />}
                    label="Logout"
                    onClick={() => {
                      auth.logout?.();
                      setIsMenuOpen(false);
                    }}
                    className="text-red-500 hover:bg-red-50"
                  />
                </>
              ) : (
                <MobileNavItem
                  icon={<User className="h-5 w-5" />}
                  label="Login"
                  onClick={() => {
                    navigate("/login");
                    setIsMenuOpen(false);
                  }}
                />
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
