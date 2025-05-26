import { useNavigate } from "react-router-dom";

interface ErrorDisplayProps {
  error: string;
  showLoginButton?: boolean;
  className?: string;
}

export const ErrorDisplay = ({
  error,
  showLoginButton = false,
  className = "",
}: ErrorDisplayProps) => {
  const navigate = useNavigate();

  return (
    <div className={`p-4 bg-red-50 text-red-700 rounded-md ${className}`}>
      <p>{error}</p>
      {showLoginButton && (
        <button
          onClick={() => navigate("/login")}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Go to Login
        </button>
      )}
    </div>
  );
};
