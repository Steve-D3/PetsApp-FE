import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Button } from "@/components/atoms/Button";
import { LoadingSpinner } from "@/components/atoms/LoadingSpinner";

export const EmailVerify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      const verifyUrl = searchParams.get("verify_url");

      if (!verifyUrl) {
        setError("Invalid verification link: Missing verification URL");
        setIsVerifying(false);
        return;
      }

      try {
        // The verifyUrl is already the full URL, we can use it directly
        const response = await fetch(verifyUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          // Include credentials if your API requires authentication
          credentials: "include",
        });

        if (response.ok) {
          // Handle successful verification
          const data = await response.json().catch(() => ({})); // In case response has no body
          setIsVerified(true);
          toast.success(
            data.message || "Your email has been verified successfully!"
          );

          // Redirect to login after a short delay
          setTimeout(() => {
            navigate("/login", {
              state: {
                message: "Email verified successfully! You can now log in.",
              },
            });
          }, 3000);
        } else {
          // Handle API error response
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message ||
              "Failed to verify email. The link may be invalid or expired."
          );
        }
      } catch (err) {
        console.error("Verification error:", err);
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred during verification"
        );
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  if (isVerifying) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <LoadingSpinner className="mx-auto h-12 w-12" />
          <p className="mt-4 text-lg">Verifying your email...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
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
          </div>
          <h2 className="mt-3 text-xl font-medium text-gray-900">
            Verification Failed
          </h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <div className="mt-6 space-y-4">
            <Button
              onClick={() => navigate("/login")}
              className="w-full"
              variant="primary"
            >
              Go to Login
            </Button>
            <Button
              onClick={() => window.location.reload()}
              className="w-full"
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isVerified) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
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
          </div>
          <h2 className="mt-3 text-xl font-medium text-gray-900">
            Email Verified Successfully
          </h2>
          <p className="mt-2 text-gray-600">
            Your email has been verified. You will be redirected to the login
            page shortly.
          </p>
          <Button
            onClick={() => navigate("/login")}
            className="mt-6 w-full"
            variant="primary"
          >
            Go to Login Now
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

export default EmailVerify;
