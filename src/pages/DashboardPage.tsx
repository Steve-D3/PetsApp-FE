import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../features/auth/hooks/useAuth";
import { MainLayout } from "../components/layout/MainLayout";

const DashboardPage = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600">You're now logged in to your dashboard.</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
