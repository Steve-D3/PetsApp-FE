import { MobileNavItem } from "@/components/atoms/MobileNavItem";
import { Home, CalendarDays, User, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const auth = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-white border-t border-gray-200">
      <div className="px-2 pt-2 pb-3 space-y-1">
        {auth.isAuthenticated ? (
          <>
            <MobileNavItem
              icon={<Home />}
              label="Home"
              onClick={() => {
                navigate("/");
                onClose();
              }}
            />
            <MobileNavItem
              icon={<CalendarDays />}
              label="Appointments"
              onClick={() => {
                navigate("/appointments");
                onClose();
              }}
            />
            <MobileNavItem
              icon={<User />}
              label="Profile"
              onClick={() => {
                navigate("/profile");
                onClose();
              }}
            />
            <MobileNavItem
              icon={<Settings />}
              label="Settings"
              onClick={() => {
                navigate("/settings");
                onClose();
              }}
            />
            <MobileNavItem
              icon={<LogOut />}
              label="Logout"
              onClick={() => {
                auth.logout?.();
                onClose();
              }}
              className="text-red-500 hover:bg-red-50"
            />
          </>
        ) : (
          <MobileNavItem
            icon={<User />}
            label="Login"
            onClick={() => {
              navigate("/login");
              onClose();
            }}
          />
        )}
      </div>
    </div>
  );
};
