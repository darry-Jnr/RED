import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db, provider } from "../../firebase/firebaseConfig";
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
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleValidation = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Please enter your email.";
    if (!formData.password) newErrors.password = "Please enter your password.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const redirectByRole = async (uid: string) => {
    const clientSnap = await getDoc(doc(db, "users", uid));
    const freelancerSnap = await getDoc(doc(db, "freelancers", uid));

    if (clientSnap.exists()) {
      localStorage.setItem("role", "client");
      localStorage.setItem("uid", uid);
      localStorage.setItem("email", clientSnap.data().email);
      toast.success("Logged in as Client");
      navigate("/client");
    } else if (freelancerSnap.exists()) {
      localStorage.setItem("role", "freelancer");
      localStorage.setItem("uid", uid);
      localStorage.setItem("email", freelancerSnap.data().email);
      toast.success("Logged in as Freelancer");
      navigate("/freelancer");
    } else {
      toast.error("User role not found. Please contact support.");
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    if (!handleValidation()) return;

    try {
      const result = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = result.user;

      // Check if email is verified
      if (!user.emailVerified) {
        toast.error("Please verify your email before logging in.");
        return;
      }

      await redirectByRole(user.uid);
    } catch (error) {
      let msg = "Login failed";
      const err = error.code;

      if (err === "auth/user-not-found") msg = "No account found with this email.";
      else if (err === "auth/wrong-password") msg = "Incorrect password.";
      else if (err === "auth/invalid-email") msg = "Invalid email address.";
      else if (err === "auth/too-many-requests") msg = "Too many login attempts. Try again later.";

      toast.error(msg);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const clientDoc = await getDoc(doc(db, "users", user.uid));
      const freelancerDoc = await getDoc(doc(db, "freelancers", user.uid));

      if (clientDoc.exists()) {
        localStorage.setItem("role", "client");
        localStorage.setItem("uid", user.uid);
        localStorage.setItem("email", user.email);
        toast.success("Signed in as Client");
        navigate("/client");
      } else if (freelancerDoc.exists()) {
        localStorage.setItem("role", "freelancer");
        localStorage.setItem("uid", user.uid);
        localStorage.setItem("email", user.email);
        toast.success("Signed in as Freelancer");
        navigate("/freelancer");
      } else {
        toast.error("Google account not registered. Please sign up first.");
      }
    } catch (error) {
      toast.error("Google Sign-In Error: " + error.message);
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

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 my-4">
            <button
              onClick={handleGoogleSignIn}
              className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 bg-gray-100 rounded-lg px-7 hover:bg-gray-200 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                <path
                  fill="#4285F4"
                  d="M18.75 10.19c0-.72-.06-1.24-.18-1.78H10.18v3.25h4.92c-.1.81-.65 2-1.87 2.83l2.66 2.03c1.55-1.43 2.34-3.54 2.34-6.33z"
                />
                <path
                  fill="#34A853"
                  d="M10.18 18.75c2.41 0 4.43-.8 5.91-2.13l-2.82-2.13c-.8.53-1.86.89-3.09.89-2.37 0-4.38-1.61-5.1-3.76H2.24v2.17A8.57 8.57 0 0 0 10.18 18.75z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.09 11.73a5.6 5.6 0 0 1 0-3.46V6.09H2.29A8.57 8.57 0 0 0 1.25 10c0 1.42.35 2.76 1.04 3.91l2.8-2.18z"
                />
                <path
                  fill="#EB4335"
                  d="M10.18 4.63c1.31 0 2.47.45 3.4 1.34l2.54-2.54C14.61 1.99 12.6 1.25 10.18 1.25c-3.49 0-6.49 1.98-7.94 4.84l2.85 2.19c.72-2.09 2.75-3.65 5.09-3.65z"
                />
              </svg>
              Sign in with Google
            </button>
          </div>

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
