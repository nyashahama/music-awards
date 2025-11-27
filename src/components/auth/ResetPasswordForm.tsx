import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import Alert from "../ui/alert/Alert";
import { useAuth } from "../../hooks/useUsers";

type FormErrors = {
  password?: string;
  confirmPassword?: string;
};

export default function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [alert, setAlert] = useState<{
    variant: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState({
    password: false,
    confirmPassword: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  const passwordInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  // Use the auth hook
  const { resetPassword, validateResetToken } = useAuth();

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setTokenValid(false);
        setAlert({
          variant: "error",
          title: "Invalid Link",
          message: "This password reset link is invalid or has expired.",
        });
        return;
      }

      try {
        // Use the actual validateResetToken function
        await validateResetToken(token);
        setTokenValid(true);
      } catch (error: any) {
        setTokenValid(false);
        setAlert({
          variant: "error",
          title: "Invalid Link",
          message:
            error?.response?.data?.error ||
            "This password reset link is invalid or has expired.",
        });
      }
    };

    verifyToken();
  }, [token, validateResetToken]);

  // Auto-focus password field when token is valid
  useEffect(() => {
    if (tokenValid) {
      passwordInputRef.current?.focus();
    }
  }, [tokenValid]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    const field = name as keyof FormErrors;
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const field = name as keyof typeof touched;

    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));

    // Validate on blur for better UX
    if (touched[field]) {
      const validationErrors = validateForm();
      if (validationErrors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: validationErrors[field],
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({ password: true, confirmPassword: true });

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      passwordInputRef.current?.focus();
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      if (!token) {
        throw new Error("Reset token is missing");
      }

      // Use the actual resetPassword function
      await resetPassword({
        token,
        new_password: formData.password,
      });

      setResetSuccess(true);
      setAlert({
        variant: "success",
        title: "Password Reset Successful",
        message: "Your password has been reset successfully.",
      });

      // Redirect to sign in after 2 seconds
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (error: any) {
      setAlert({
        variant: "error",
        title: "Password Reset Failed",
        message:
          error?.response?.data?.error ||
          "Something went wrong. Please try again or request a new reset link.",
      });

      // Auto-dismiss error alerts after 5 seconds
      setTimeout(() => setAlert(null), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): FormErrors => {
    const errors: FormErrors = {};

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    } else if (formData.password.length > 128) {
      errors.password = "Password must be less than 128 characters";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  // Show loading state while verifying token
  if (tokenValid === null) {
    return (
      <div className="flex flex-col flex-1">
        <div className="flex flex-col items-center justify-center flex-1 w-full max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 rounded-full border-brand-500 border-t-transparent animate-spin"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Verifying reset link...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if token is invalid
  if (tokenValid === false) {
    return (
      <div className="flex flex-col flex-1">
        {alert && (
          <Alert variant={alert.variant} title={alert.title}>
            {alert.message}
          </Alert>
        )}
        <div className="flex flex-col items-center justify-center flex-1 w-full max-w-md px-6 mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-error-50 dark:bg-error-500/10">
              <svg
                className="w-8 h-8 text-error-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white/90">
              Invalid Reset Link
            </h2>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              This password reset link is invalid or has expired. Please request
              a new one.
            </p>
            <div className="flex flex-col w-full gap-3 sm:flex-row">
              <Link to="/forgot-password" className="flex-1">
                <Button type="button" className="w-full" size="sm">
                  Request New Link
                </Button>
              </Link>
              <Link to="/signin" className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  size="sm"
                >
                  Back to Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      {alert && (
        <Alert variant={alert.variant} title={alert.title}>
          {alert.message}
        </Alert>
      )}
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          to="/signin"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to sign in
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              {resetSuccess ? "Password Reset!" : "Reset Your Password"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {resetSuccess
                ? "Your password has been successfully reset. Redirecting you to sign in..."
                : "Enter your new password below."}
            </p>
          </div>

          {resetSuccess ? (
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-white/5 dark:border-gray-800">
              <div className="flex items-start gap-3">
                <svg
                  className="flex-shrink-0 mt-0.5 w-5 h-5 text-success-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <div className="flex-1">
                  <h3 className="mb-1 text-sm font-medium text-gray-800 dark:text-white/90">
                    Success!
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You can now sign in with your new password.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <fieldset disabled={isLoading} className="space-y-6">
                <div>
                  <Label htmlFor="password">
                    New Password <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      ref={passwordInputRef}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your new password"
                      name="password"
                      autoComplete="new-password"
                      value={formData.password}
                      required
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={!!errors.password}
                      aria-describedby={
                        errors.password ? "password-error" : undefined
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 right-4 top-1/2"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p
                      id="password-error"
                      className="mt-1 text-sm text-error-500"
                      role="alert"
                    >
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirmPassword">
                    Confirm New Password{" "}
                    <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your new password"
                      name="confirmPassword"
                      autoComplete="new-password"
                      value={formData.confirmPassword}
                      required
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={!!errors.confirmPassword}
                      aria-describedby={
                        errors.confirmPassword
                          ? "confirmPassword-error"
                          : undefined
                      }
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute z-30 -translate-y-1/2 right-4 top-1/2"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p
                      id="confirmPassword-error"
                      className="mt-1 text-sm text-error-500"
                      role="alert"
                    >
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <div>
                  <Button
                    type="submit"
                    className="w-full"
                    size="sm"
                    disabled={isLoading}
                  >
                    {isLoading ? "Resetting Password..." : "Reset Password"}
                  </Button>
                </div>
              </fieldset>
            </form>
          )}

          {!resetSuccess && (
            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Remember your password?{" "}
                <Link
                  to="/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign In
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
