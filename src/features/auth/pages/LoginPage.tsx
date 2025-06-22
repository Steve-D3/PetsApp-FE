import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import authApi from "../api/authApi";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";

type LoginForm = {
  email: string;
  password: string;
};

type LocationState = {
  from?: {
    pathname: string;
  };
};

type ResetStatus = {
  success: boolean;
  message: string;
} | null;

export const LoginPage = () => {
  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetStatus, setResetStatus] = useState<ResetStatus>(null);
  const [isResetting, setIsResetting] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as LocationState)?.from?.pathname || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      await auth.login?.(formData);
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      toast.error(
        errorMessage.includes("401") || errorMessage.includes("credentials")
          ? "Invalid email or password"
          : "Failed to log in. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="h-screen flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-center">
            <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
            <p className="text-blue-100 mt-1">Sign in to your account</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  label="Email address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>

              <div>
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full"
                />
                <div className="mt-2 text-right">
                  <button
                    type="button"
                    onClick={() => setForgotPasswordOpen(true)}
                    className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none text-sm"
                  >
                    Forgot your password?
                  </button>
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </Button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Don't have an account?
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to="/register"
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Create account
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our{" "}
            <Link to="/terms" className="text-blue-600 hover:text-blue-500">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotPasswordOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Reset Password
              </h2>
              <button
                onClick={() => {
                  setForgotPasswordOpen(false);
                  setResetStatus(null);
                  setResetEmail("");
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {!resetStatus ? (
              <>
                <p className="mb-4 text-gray-600">
                  Enter your email address and we'll send you a link to reset
                  your password.
                </p>
                <div className="mb-4">
                  <label
                    htmlFor="reset-email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email address
                  </label>
                  <input
                    type="email"
                    id="reset-email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setForgotPasswordOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!resetEmail) return;
                      try {
                        setIsResetting(true);
                        await authApi.forgotPassword({ email: resetEmail });
                        setResetStatus({
                          success: true,
                          message:
                            "Password reset link has been sent to your email.",
                        });
                      } catch (error: unknown) {
                        const errorMessage =
                          error instanceof Error
                            ? error.message
                            : "An unknown error occurred";
                        console.error("Password reset error:", error);
                        setResetStatus({
                          success: false,
                          message: errorMessage,
                        });
                      } finally {
                        setIsResetting(false);
                      }
                    }}
                    disabled={isResetting || !resetEmail}
                    className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      isResetting || !resetEmail
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {isResetting ? "Sending..." : "Send Reset Link"}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <div
                  className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${
                    resetStatus.success ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {resetStatus.success ? (
                    <svg
                      className="h-6 w-6 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-6 w-6 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </div>
                <p
                  className={`mt-3 text-sm ${
                    resetStatus.success ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {resetStatus.message}
                </p>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotPasswordOpen(false);
                      setResetStatus(null);
                      setResetEmail("");
                    }}
                    className="text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
                  >
                    {resetStatus.success ? "Back to login" : "Try again"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
