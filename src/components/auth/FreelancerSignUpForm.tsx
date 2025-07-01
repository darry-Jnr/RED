import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    EyeIcon,
    EyeCloseIcon,
    ChevronLeftIcon,
} from "../../icons";
import { auth, db } from "../../firebase/firebaseConfig";
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";

import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";

export default function FreelancerSignUpForm() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [formData, setFormData] = useState({
        fname: "",
        lname: "",
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const handleValidation = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.fname) newErrors.fname = "First name is required.";
        if (!formData.lname) newErrors.lname = "Last name is required.";
        if (!formData.email) newErrors.email = "Email is required.";
        if (!formData.password) newErrors.password = "Password is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!handleValidation()) return;

        const { fname, lname, email, password } = formData;
        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await sendEmailVerification(user);

            await setDoc(doc(db, "freelancers", user.uid), {
                firstName: fname,
                lastName: lname,
                email,
                uid: user.uid,
                role: "freelancer",
                createdAt: new Date(),
            });

            toast.success("Account created! Please verify your email.");
            navigate("/verify-email");
        } catch (error: any) {
            toast.error("Signup failed: " + error.message);
        } finally {
            setLoading(false);
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
                        Freelancer Sign Up
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Enter your details to create an account!
                    </p>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                        <div>
                            <Label>First Name <span className="text-error-500">*</span></Label>
                            <Input
                                type="text"
                                value={formData.fname}
                                onChange={(e) => setFormData({ ...formData, fname: e.target.value })}
                                placeholder="John"
                            />
                            {errors.fname && <p className="text-sm text-red-500">{errors.fname}</p>}
                        </div>

                        <div>
                            <Label>Last Name <span className="text-error-500">*</span></Label>
                            <Input
                                type="text"
                                value={formData.lname}
                                onChange={(e) => setFormData({ ...formData, lname: e.target.value })}
                                placeholder="Doe"
                            />
                            {errors.lname && <p className="text-sm text-red-500">{errors.lname}</p>}
                        </div>

                        <div>
                            <Label>Email <span className="text-error-500">*</span></Label>
                            <Input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="you@example.com"
                            />
                            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                        </div>

                        <div>
                            <Label>Password <span className="text-error-500">*</span></Label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="Enter your password"
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
                            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                        </div>

                        <div className="flex items-center gap-3">
                            <Checkbox checked={isChecked} onChange={setIsChecked} />
                            <span className="text-gray-700 dark:text-gray-400 text-sm">
                                I agree to the terms and privacy policy
                            </span>
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Creating Account..." : "Sign Up"}
                        </Button>
                    </form>

                    <div className="mt-5 text-center text-sm text-gray-700 dark:text-gray-400">
                        Already have an account?{" "}
                        <Link
                            to="/signin"
                            className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
