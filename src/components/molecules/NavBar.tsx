import { NavItem } from "@/components/atoms/NavItem";
import { Home, CalendarDays, Settings, LogOut, Cat } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const NavBar = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="hidden md:flex items-center space-x-2">
      <NavItem icon={<Home />} label="Home" onClick={() => navigate("/")} />
      <NavItem
        icon={<CalendarDays />}
        label="Appointments"
        onClick={() => navigate("/appointments")}
      />
      <NavItem icon={<Cat />} label="Pets" onClick={() => navigate("/pets")} />
      <NavItem
        icon={<Settings />}
        label="Settings"
        onClick={() => navigate("/settings")}
      />
      <NavItem
        icon={<LogOut />}
        label="Logout"
        onClick={() => auth.logout?.()}
        className="text-red-500 hover:text-red-600"
      />
    </nav>
  );
};
