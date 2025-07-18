import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseConfig";
import { toast } from "react-hot-toast";
import {
  ChevronLeftIcon,
  EyeCloseIcon,
  EyeIcon,
} from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const handleValidation = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = "Please enter your email.";
    if (!formData.password) newErrors.password = "Please enter your password.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRedirect = async (uid: string, email: string) => {
    const clientRef = doc(db, "users", uid);
    const freelancerRef = doc(db, "freelancers", uid);

    const [clientSnap, freelancerSnap] = await Promise.all([
      getDoc(clientRef),
      getDoc(freelancerRef),
    ]);

    localStorage.setItem("uid", uid);
    localStorage.setItem("email", email);

    if (clientSnap.exists() && freelancerSnap.exists()) {
      return navigate("/choose-dashboard");
    } else if (clientSnap.exists()) {
      localStorage.setItem("role", "client");
      toast.success("Logged in as Client");
      return navigate("/clients");
    } else if (freelancerSnap.exists()) {
      localStorage.setItem("role", "freelancer");
      toast.success("Logged in as Freelancer");
      return navigate("/freelancer");
    } else {
      toast.error("No matching account found. Please sign up.");
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handleValidation()) return;

    try {
      const result = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = result.user;

      if (!user.emailVerified) {
        toast.error("Please verify your email before logging in.");
        return;
      }

      await handleRedirect(user.uid, user.email || "");
    } catch (error: any) {
      const err = error.code;
      let msg = "Login failed";
      const newErrors: Record<string, string> = {};

      if (err === "auth/user-not-found") {
        msg = "No account found with this email. Redirecting to Sign Up...";
        newErrors.email = "Redirecting to sign up...";
        toast.error(msg);
        setErrors(newErrors);
        setTimeout(() => {
          navigate("/choose-role"); // 👈 update to your sign-up route if different
        }, 2000);
        return;
      } else if (err === "auth/wrong-password") {
        msg = "Incorrect password.";
        newErrors.password = msg;
      } else if (err === "auth/invalid-email") {
        msg = "Invalid email address.";
        newErrors.email = msg;
      } else if (err === "auth/too-many-requests") {
        msg = "Too many login attempts. Try again later.";
        newErrors.password = msg;
      }

      setErrors(newErrors);
      toast.error(msg);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to dashboard
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Sign In
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your email and password to sign in!
          </p>

          <form onSubmit={handleEmailSignIn}>
            <div className="space-y-6">
              <div>
                <Label>
                  Email <span className="text-error-500">*</span>
                </Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <Label>
                  Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute cursor-pointer right-4 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox checked={isChecked} onChange={setIsChecked} />
                  <span className="text-gray-700 dark:text-gray-400 text-sm">
                    Keep me logged in
                  </span>
                </div>
                <Link
                  to="/reset-password"
                  className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Forgot password?
                </Link>
              </div>

              <div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
            </div>
          </form>

          <div className="mt-5 text-center text-sm text-gray-700 dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              to="/choose-role"
              className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
