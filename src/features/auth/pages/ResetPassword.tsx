import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Card } from "@/components/atoms/Card";
import { LoadingSpinner } from "@/components/atoms/LoadingSpinner";
import { Text } from "@/components/atoms/Text";
import { authApi } from "../api/authApi";

// Define form validation schema
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      toast.error("Invalid reset link");
      return;
    }

    try {
      setIsLoading(true);
      await authApi.resetPassword({
        token,
        email,
        password: data.password,
        password_confirmation: data.confirmPassword,
      });

      toast.success("Password has been reset successfully!");
      navigate("/login");
    } catch (error: unknown) {
      const errorMessage =
        (error as { response: { data: { message: string } } })?.response?.data
          ?.message || "Failed to reset password";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Text variant="h2" className="text-3xl font-extrabold text-gray-900">
            Reset Password
          </Text>
          <Text variant="body" className="mt-2 text-sm text-gray-600">
            Enter your new password below to reset your account
          </Text>
        </div>

        <Card className="px-6 py-8 sm:px-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Input
                id="password"
                type="password"
                label="New Password"
                placeholder="Enter your new password"
                autoComplete="new-password"
                disabled={isLoading}
                error={errors.password?.message}
                {...register("password")}
              />
            </div>

            <div>
              <Input
                id="confirmPassword"
                type="password"
                label="Confirm New Password"
                placeholder="Confirm your new password"
                autoComplete="new-password"
                disabled={isLoading}
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />
            </div>

            <div>
              <Button
                type="submit"
                className="w-full"
                variant="primary"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner className="mr-2 h-4 w-4" />
                    Resetting Password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <Text variant="body" className="text-gray-600">
              Remember your password?{" "}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in
              </Link>
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
