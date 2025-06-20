import { Link } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";

export const HomePage = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return null; // Will be redirected by the router
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Welcome to PawsApp
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Manage your pets with ease
          </p>
        </div>
        <div className="space-x-4">
          <Link
            to="/login"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="inline-block px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
