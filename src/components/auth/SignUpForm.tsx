import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import toast from "react-hot-toast";

import { auth, db } from "../../firebase/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,

} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function SignUpForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { fname, lname, email, password, phone } = formData;
    const newErrors: Record<string, string> = {};

    if (!fname.trim()) newErrors.fname = "First name is required";
    if (!lname.trim()) newErrors.lname = "Last name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (!password.trim()) newErrors.password = "Password is required";
    if (!phone.trim()) newErrors.phone = "Phone number is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        firstName: fname,
        lastName: lname,
        email,
        phone,
        role: "client",
        bio: "",
        createdAt: new Date(),
      });

      await sendEmailVerification(user);
      toast.success("Account created! Please check your email to verify.");
      navigate("/verify-email");
    } catch (error: any) {
      console.error("Signup Error:", error.message);
      if (error.code === "auth/email-already-in-use") {
        toast.error("Email already in use. Please sign in instead.");
      } else {
        toast.error("Signup failed: " + error.message);
      }
    }
  };


  return (
    <div className="w-full max-w-md mx-auto px-4 py-8">
      <Link to="/" className="text-sm text-gray-500 hover:underline flex items-center mb-4">
        <ChevronLeftIcon className="w-5 h-5 mr-2" />
        Back to dashboard
      </Link>

      <h1 className="text-2xl font-semibold mb-2">Sign Up</h1>
      <p className="text-sm text-gray-500 mb-6">Enter your details to sign up!</p>



      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>First Name *</Label>
            <Input
              type="text"
              value={formData.fname}
              onChange={(e) => setFormData({ ...formData, fname: e.target.value })}
            />
            {errors.fname && <p className="text-red-500 text-sm">{errors.fname}</p>}
          </div>
          <div>
            <Label>Last Name *</Label>
            <Input
              type="text"
              value={formData.lname}
              onChange={(e) => setFormData({ ...formData, lname: e.target.value })}
            />
            {errors.lname && <p className="text-red-500 text-sm">{errors.lname}</p>}
          </div>
        </div>

        <div>
          <Label>Email *</Label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        <div>
          <Label>Phone *</Label>
          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
        </div>

        <div>
          <Label>Password *</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <span
              className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeIcon className="w-5 h-5 text-gray-500" />
              ) : (
                <EyeCloseIcon className="w-5 h-5 text-gray-500" />
              )}
            </span>
          </div>
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </div>

        <div className="flex items-center gap-2">
          <Checkbox checked={isChecked} onChange={setIsChecked} />
          <p className="text-sm text-gray-600">
            By creating an account you agree to the{" "}
            <span className="text-blue-600 underline">Terms</span> and{" "}
            <span className="text-blue-600 underline">Privacy Policy</span>.
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Sign Up
        </button>
      </form>

      <p className="text-sm text-center text-gray-600 mt-6">
        Already have an account?{" "}
        <Link to="/signin" className="text-blue-600 hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}
