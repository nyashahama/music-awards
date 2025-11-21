import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { ChevronLeftIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import Alert from "../ui/alert/Alert";

type FormErrors = {
  email?: string;
};

export default function ForgotPasswordForm() {
  const [alert, setAlert] = useState<{
    variant: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    email: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState({
    email: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const emailInputRef = useRef<HTMLInputElement>(null);

  // TODO: Import and use your auth hook if available
  // const { forgotPassword } = useAuth();

  // Auto-focus email field on mount
  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

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
    setTouched({ email: true });

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      emailInputRef.current?.focus();
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      // TODO: Replace with your actual API call
      // await forgotPasswordAPI(formData.email.trim());

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setEmailSent(true);
      setAlert({
        variant: "success",
        title: "Email Sent",
        message: "Password reset instructions have been sent to your email.",
      });
    } catch (error: any) {
      setAlert({
        variant: "error",
        title: "Failed to Send Email",
        message:
          error?.response?.data?.error ||
          "Something went wrong. Please try again.",
      });

      // Auto-dismiss error alerts after 5 seconds
      setTimeout(() => setAlert(null), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): FormErrors => {
    const errors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address";
    }

    return errors;
  };

  const handleResendEmail = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with your actual API call
      // await forgotPasswordAPI(formData.email.trim());

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setAlert({
        variant: "success",
        title: "Email Resent",
        message: "Password reset instructions have been resent to your email.",
      });
    } catch (error: any) {
      setAlert({
        variant: "error",
        title: "Failed to Resend Email",
        message:
          error?.response?.data?.error ||
          "Something went wrong. Please try again.",
      });
      setTimeout(() => setAlert(null), 5000);
    } finally {
      setIsLoading(false);
    }
  };

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
              {emailSent ? "Check Your Email" : "Forgot Password?"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {emailSent
                ? `We've sent password reset instructions to ${formData.email}`
                : "Enter your email address and we'll send you instructions to reset your password."}
            </p>
          </div>

          {emailSent ? (
            <div className="space-y-5">
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-white/5 dark:border-gray-800">
                <div className="flex items-start gap-3">
                  <svg
                    className="flex-shrink-0 mt-0.5 w-5 h-5 text-brand-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <div className="flex-1">
                    <h3 className="mb-1 text-sm font-medium text-gray-800 dark:text-white/90">
                      Email Sent Successfully
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Please check your inbox and follow the instructions to
                      reset your password. The link will expire in 1 hour.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                  Didn't receive the email?
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleResendEmail}
                  disabled={isLoading}
                >
                  {isLoading ? "Resending..." : "Resend Email"}
                </Button>
              </div>

              <div className="pt-3 text-center">
                <Link
                  to="/signin"
                  className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <fieldset disabled={isLoading} className="space-y-6">
                <div>
                  <Label htmlFor="email">
                    Email <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    ref={emailInputRef}
                    id="email"
                    placeholder="info@gmail.com"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    required
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && (
                    <p
                      id="email-error"
                      className="mt-1 text-sm text-error-500"
                      role="alert"
                    >
                      {errors.email}
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
                    {isLoading ? "Sending..." : "Send Reset Instructions"}
                  </Button>
                </div>
              </fieldset>
            </form>
          )}

          {!emailSent && (
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
