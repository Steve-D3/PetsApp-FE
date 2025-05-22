import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { NavBar } from "../molecules/NavBar";
import { MobileMenu } from "../molecules/MobileMenu";
import type { HeaderProps } from "@/lib/types/types.d";

export const Header = ({
  isMenuOpen,
  onMenuToggle,
  onMenuClose,
}: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-gray-900">PetsApp</span>
          </Link>

          {/* Desktop Navigation */}
          <NavBar />

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={onMenuToggle}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <MobileMenu isOpen={isMenuOpen} onClose={onMenuClose} />
    </header>
  );
};
