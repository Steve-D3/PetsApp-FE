import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../features/auth/hooks/useAuth";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const auth = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-gray-900">
              PetsApp
            </Link>
            <nav className="flex items-center space-x-4">
              {auth.isAuthenticated ? (
                <>
                  <span className="text-gray-700">
                    Welcome, {auth.user?.name}
                  </span>
                  <button
                    onClick={() => auth.logout?.()}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-grow">{children}</main>
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} PetsApp. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
