import { useEffect, forwardRef, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Icons
import { BookOpen, Mail, AlertCircle, Eye, EyeOff } from "lucide-react";

// Context and Types
import { useAuth } from "@/contexts/authContext";
import type { RegisterData } from "@/types";

/**
 * =============================================================================
 *  Helper Components (Included for completeness)
 * =============================================================================
 */

const AuthLayout = ({ aside, children }) => (
  <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
    <div className="hidden lg:block">{aside}</div>
    <div className="flex items-center justify-center p-6 sm:p-8">
      {children}
    </div>
  </div>
);

const WelcomePanel = () => (
  <div
    className="h-full bg-muted p-10 text-white flex-col justify-between hidden lg:flex bg-cover bg-center"
    style={{
      backgroundImage:
        "url(https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=3900)",
    }}
  >
    <Link to="/" className="flex items-center space-x-2 text-lg font-bold">
      <BookOpen className="w-6 h-6" />
      <span>Book-Web</span>
    </Link>
    <div className="mt-auto">
      <h1 className="text-3xl font-bold">
        Join a community of readers and creators.
      </h1>
      <p className="text-muted-foreground mt-2 text-gray-200">
        Create an account to start your journey with us today.
      </p>
    </div>
  </div>
);

const GoogleAuthButton = ({ isLoading }) => (
  <Button variant="outline" className="w-full" disabled={isLoading}>
    <svg
      className="mr-2 h-4 w-4"
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 488 512"
    >
      <path
        fill="currentColor"
        d="M488 261.8C488 403.3 381.5 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-67.7 67.7C314.6 114.5 283.5 96 248 96c-88.8 0-160.1 71.1-160.1 160.1s71.3 160.1 160.1 160.1c98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
      ></path>
    </svg>
    Sign up with Google
  </Button>
);

const SeparatorWithText = ({ children }) => (
  <div className="relative my-6">
    <div className="absolute inset-0 flex items-center">
      <span className="w-full border-t" />
    </div>
    <div className="relative flex justify-center text-xs uppercase">
      <span className="bg-background px-2 text-muted-foreground">
        {children}
      </span>
    </div>
  </div>
);

const PasswordInput = forwardRef(({ ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        className="pl-4 pr-10 rounded-2xl"
        ref={ref}
        {...props}
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        onClick={() => setShowPassword(!showPassword)}
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </div>
  );
});

const AuthFormLink = ({ to, promptText, linkText }) => (
  <div className="text-center text-sm">
    <span className="text-muted-foreground">{promptText} </span>
    <Link to={to} className="text-primary hover:underline font-medium">
      {linkText}
    </Link>
  </div>
);

/**
 * =============================================================================
 *  Main RegisterPage Component
 * =============================================================================
 */
const RegisterPage = () => {
  const {
    register: registerUser,
    isLoading,
    error: authError,
    clearError,
    isAuthenticated,
  } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<RegisterData>();

  const password = watch("password");

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/user/home", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (authError) {
      setError("root.serverError", { type: "manual", message: authError });
    }
  }, [authError, setError]);

  const handleInputChange = () => {
    if (authError) {
      clearError();
      clearErrors("root.serverError");
    }
  };

  const onSubmit: SubmitHandler<RegisterData> = async (data) => {
    clearError();
    try {
      await registerUser(data);
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <AuthLayout aside={<WelcomePanel />}>
      <Card className="w-full max-w-md border-0 bg-background/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-6 h-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Create an Account
          </CardTitle>
          <CardDescription>
            Start your journey with Book-Web today
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {errors.root?.serverError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {errors.root.serverError.message}
              </AlertDescription>
            </Alert>
          )}

          <GoogleAuthButton isLoading={isLoading} />
          <SeparatorWithText>Or register with email</SeparatorWithText>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* --- START: NAME FIELDS UPDATE --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  className="rounded-2xl"
                  disabled={isLoading}
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                  onChange={handleInputChange}
                />
                {errors.firstName && (
                  <p className="text-sm text-destructive">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  className="rounded-2xl"
                  disabled={isLoading}
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                  onChange={handleInputChange}
                />
                {errors.lastName && (
                  <p className="text-sm text-destructive">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>
            {/* --- END: NAME FIELDS UPDATE --- */}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10 rounded-2xl"
                  disabled={isLoading}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  })}
                  onChange={handleInputChange}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <PasswordInput
                id="password"
                placeholder="Create a password"
                disabled={isLoading}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                onChange={handleInputChange}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <PasswordInput
                id="confirmPassword"
                placeholder="Confirm your password"
                disabled={isLoading}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                onChange={handleInputChange}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full rounded-2xl"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <AuthFormLink
            to="/login"
            promptText="Already have an account?"
            linkText="Sign In"
          />
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default RegisterPage;
