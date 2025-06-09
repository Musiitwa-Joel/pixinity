import type React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Camera,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Building,
  UserCheck,
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type AuthMode = "login" | "signup" | "forgot-password" | "reset-password";

interface LoginForm {
  email: string;
  password: string;
}

interface SignupForm {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "photographer" | "company";
  agreeToTerms: boolean;
}

interface ForgotPasswordForm {
  email: string;
}

const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, register, isLoading } = useAuth();
  const [mode, setMode] = useState<AuthMode>(
    (searchParams.get("mode") as AuthMode) || "login"
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const loginForm = useForm<LoginForm>();
  const signupForm = useForm<SignupForm>();
  const forgotPasswordForm = useForm<ForgotPasswordForm>();

  const handleLogin = async (data: LoginForm) => {
    setLoginError(null);
    try {
      console.log("Login form submitted:", {
        email: data.email,
        password: "***",
      });
      await login(data.email, data.password);
      toast.success("Welcome back!");
      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
      setLoginError(error.message || "Invalid email or password");
      toast.error(error.message || "Invalid email or password");
    }
  };

  const handleSignup = async (data: SignupForm) => {
    setRegisterError(null);
    if (data.password !== data.confirmPassword) {
      setRegisterError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    try {
      console.log("Registration form submitted:", {
        email: data.email,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
      });

      await register(data, data.password);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (error: any) {
      console.error("Registration error:", error);
      setRegisterError(error.message || "Failed to create account");
      toast.error(error.message || "Failed to create account");
    }
  };

  const handleForgotPassword = async (data: ForgotPasswordForm) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Password reset link sent to your email");
    setMode("login");
  };

  const authModes = {
    login: {
      title: "Welcome back",
      subtitle: "Sign in to your account to continue your creative journey",
      submitText: "Sign In",
      switchText: "Don't have an account?",
      switchAction: "Sign up",
      switchMode: "signup" as AuthMode,
    },
    signup: {
      title: "Join Pixinity",
      subtitle:
        "Create your account and start sharing your amazing photography",
      submitText: "Create Account",
      switchText: "Already have an account?",
      switchAction: "Sign in",
      switchMode: "login" as AuthMode,
    },
    "forgot-password": {
      title: "Reset Password",
      subtitle:
        "Enter your email address and we'll send you a link to reset your password",
      submitText: "Send Reset Link",
      switchText: "Remember your password?",
      switchAction: "Sign in",
      switchMode: "login" as AuthMode,
    },
    "reset-password": {
      title: "Create New Password",
      subtitle: "Enter your new password below",
      submitText: "Update Password",
      switchText: "Back to",
      switchAction: "Sign in",
      switchMode: "login" as AuthMode,
    },
  };

  const currentMode = authModes[mode];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/"
              className="inline-flex items-center space-x-2 group mb-8"
            >
              <div className="relative">
                <Camera className="h-10 w-10 text-primary-600 group-hover:text-primary-700 transition-colors" />
                <div className="absolute -inset-1 bg-primary-600/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur" />
              </div>
              <span className="text-2xl font-bold text-neutral-900 group-hover:text-primary-600 transition-colors">
                Pixinity
              </span>
            </Link>

            <h2 className="text-3xl font-bold text-neutral-900 mb-2">
              {currentMode.title}
            </h2>
            <p className="text-neutral-600 leading-relaxed">
              {currentMode.subtitle}
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              {mode === "login" && (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={loginForm.handleSubmit(handleLogin)}
                  className="space-y-6"
                >
                  {loginError && (
                    <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg flex items-start">
                      <AlertCircle className="h-5 w-5 text-error-500 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{loginError}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                      <input
                        {...loginForm.register("email", {
                          required: "Email is required",
                        })}
                        type="email"
                        className="input pl-11"
                        placeholder="Enter your email"
                      />
                    </div>
                    {loginForm.formState.errors.email && (
                      <p className="mt-1 text-sm text-error-600">
                        {loginForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                      <input
                        {...loginForm.register("password", {
                          required: "Password is required",
                        })}
                        type={showPassword ? "text" : "password"}
                        className="input pl-11 pr-11"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {loginForm.formState.errors.password && (
                      <p className="mt-1 text-sm text-error-600">
                        {loginForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-neutral-600">
                        Remember me
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setMode("forgot-password")}
                      className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary w-full group"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      </div>
                    ) : (
                      <>
                        <span>{currentMode.submitText}</span>
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  {/* Test Account Info */}
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">
                      Test Account
                    </h4>
                    <div className="text-xs text-blue-700 space-y-1">
                      <p>
                        <span className="font-medium">Email:</span>{" "}
                        demo@pixinity.com
                      </p>
                      <p>
                        <span className="font-medium">Password:</span>{" "}
                        password123
                      </p>
                    </div>
                  </div>
                </motion.form>
              )}

              {mode === "signup" && (
                <motion.form
                  key="signup"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={signupForm.handleSubmit(handleSignup)}
                  className="space-y-6"
                >
                  {registerError && (
                    <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg flex items-start">
                      <AlertCircle className="h-5 w-5 text-error-500 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{registerError}</p>
                    </div>
                  )}

                  {/* Role Selection */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-3">
                      I am a...
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="relative">
                        <input
                          {...signupForm.register("role", {
                            required: "Please select your role",
                          })}
                          type="radio"
                          value="photographer"
                          className="sr-only"
                          defaultChecked
                        />
                        <div
                          className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                            signupForm.watch("role") === "photographer"
                              ? "border-primary-500 bg-primary-50"
                              : "border-neutral-200 hover:border-neutral-300"
                          }`}
                        >
                          <UserCheck className="h-6 w-6 text-primary-600 mb-2" />
                          <div className="font-medium text-neutral-900">
                            Photographer
                          </div>
                          <div className="text-sm text-neutral-600">
                            Individual creator
                          </div>
                        </div>
                      </label>
                      <label className="relative">
                        <input
                          {...signupForm.register("role", {
                            required: "Please select your role",
                          })}
                          type="radio"
                          value="company"
                          className="sr-only"
                        />
                        <div
                          className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                            signupForm.watch("role") === "company"
                              ? "border-primary-500 bg-primary-50"
                              : "border-neutral-200 hover:border-neutral-300"
                          }`}
                        >
                          <Building className="h-6 w-6 text-primary-600 mb-2" />
                          <div className="font-medium text-neutral-900">
                            Company
                          </div>
                          <div className="text-sm text-neutral-600">
                            Business account
                          </div>
                        </div>
                      </label>
                    </div>
                    {signupForm.formState.errors.role && (
                      <p className="mt-1 text-sm text-error-600">
                        {signupForm.formState.errors.role.message}
                      </p>
                    )}
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        First name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                        <input
                          {...signupForm.register("firstName", {
                            required: "First name is required",
                          })}
                          type="text"
                          className="input pl-11"
                          placeholder="John"
                        />
                      </div>
                      {signupForm.formState.errors.firstName && (
                        <p className="mt-1 text-sm text-error-600">
                          {signupForm.formState.errors.firstName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Last name
                      </label>
                      <input
                        {...signupForm.register("lastName", {
                          required: "Last name is required",
                        })}
                        type="text"
                        className="input"
                        placeholder="Doe"
                      />
                      {signupForm.formState.errors.lastName && (
                        <p className="mt-1 text-sm text-error-600">
                          {signupForm.formState.errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
                        @
                      </span>
                      <input
                        {...signupForm.register("username", {
                          required: "Username is required",
                        })}
                        type="text"
                        className="input pl-8"
                        placeholder="johndoe"
                      />
                    </div>
                    {signupForm.formState.errors.username && (
                      <p className="mt-1 text-sm text-error-600">
                        {signupForm.formState.errors.username.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                      <input
                        {...signupForm.register("email", {
                          required: "Email is required",
                        })}
                        type="email"
                        className="input pl-11"
                        placeholder="john@example.com"
                      />
                    </div>
                    {signupForm.formState.errors.email && (
                      <p className="mt-1 text-sm text-error-600">
                        {signupForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Password Fields */}
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                        <input
                          {...signupForm.register("password", {
                            required: "Password is required",
                            minLength: {
                              value: 8,
                              message: "Password must be at least 8 characters",
                            },
                          })}
                          type={showPassword ? "text" : "password"}
                          className="input pl-11 pr-11"
                          placeholder="Create a strong password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      {signupForm.formState.errors.password && (
                        <p className="mt-1 text-sm text-error-600">
                          {signupForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Confirm password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                        <input
                          {...signupForm.register("confirmPassword", {
                            required: "Please confirm your password",
                          })}
                          type={showConfirmPassword ? "text" : "password"}
                          className="input pl-11 pr-11"
                          placeholder="Confirm your password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      {signupForm.formState.errors.confirmPassword && (
                        <p className="mt-1 text-sm text-error-600">
                          {signupForm.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Terms Agreement */}
                  <div>
                    <label className="flex items-start space-x-3">
                      <input
                        {...signupForm.register("agreeToTerms", {
                          required: "You must agree to the terms",
                        })}
                        type="checkbox"
                        className="mt-1 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-neutral-600 leading-relaxed">
                        I agree to the{" "}
                        <Link
                          to="/terms"
                          className="text-primary-600 hover:text-primary-700 transition-colors"
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          to="/privacy"
                          className="text-primary-600 hover:text-primary-700 transition-colors"
                        >
                          Privacy Policy
                        </Link>
                      </span>
                    </label>
                    {signupForm.formState.errors.agreeToTerms && (
                      <p className="mt-1 text-sm text-error-600">
                        {signupForm.formState.errors.agreeToTerms.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary w-full group"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      </div>
                    ) : (
                      <>
                        <span>{currentMode.submitText}</span>
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </motion.form>
              )}

              {mode === "forgot-password" && (
                <motion.form
                  key="forgot-password"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={forgotPasswordForm.handleSubmit(
                    handleForgotPassword
                  )}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                      <input
                        {...forgotPasswordForm.register("email", {
                          required: "Email is required",
                        })}
                        type="email"
                        className="input pl-11"
                        placeholder="Enter your email address"
                      />
                    </div>
                    {forgotPasswordForm.formState.errors.email && (
                      <p className="mt-1 text-sm text-error-600">
                        {forgotPasswordForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary w-full group"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      </div>
                    ) : (
                      <>
                        <span>{currentMode.submitText}</span>
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Switch Mode */}
            <div className="text-center mt-6">
              <span className="text-neutral-600">
                {currentMode.switchText}{" "}
              </span>
              <button
                onClick={() => setMode(currentMode.switchMode)}
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                {currentMode.switchAction}
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600">
          <div className="absolute inset-0 bg-black/20"></div>
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="relative z-10 flex items-center justify-center p-12 text-white">
          <div className="max-w-md text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 backdrop-blur-md rounded-full mb-8">
                <Sparkles className="h-12 w-12 text-yellow-300" />
              </div>

              <h3 className="text-3xl font-bold mb-4">
                Join the creative community
              </h3>

              <p className="text-xl text-white/90 leading-relaxed mb-8">
                Connect with photographers worldwide, share your vision, and
                discover breathtaking imagery.
              </p>

              <div className="space-y-4">
                {[
                  { icon: CheckCircle, text: "Upload unlimited photos" },
                  { icon: CheckCircle, text: "Create beautiful collections" },
                  { icon: CheckCircle, text: "Analytics and insights" },
                  { icon: CheckCircle, text: "Connect with creators" },
                ].map((feature, index) => (
                  <motion.div
                    key={feature.text}
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  >
                    <feature.icon className="h-5 w-5 text-green-300" />
                    <span className="text-white/90">{feature.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
