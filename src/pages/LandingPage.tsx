import { useNavigate } from "react-router-dom";
import bgImg from '../assets/images/landingImg.webp';


const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <>
            {/* ✅ Hero Section */}
            <section
                className="relative w-full h-[80vh] md:h-[100vh] bg-cover bg-center bg-no-repeat flex items-center justify-center text-white"
                style={{ backgroundImage: `url(${bgImg})` }}
            >
                <div className="absolute inset-0 bg-opacity-50"></div>

                <div className="relative z-10 text-center px-4 max-w-[90%]">
                    <h1 className="text-4xl md:text-6xl font-bold font-barlow">
                        Welcome to <span className="text-[#FF3C3C]">Red</span>
                    </h1>
                    <p className="mt-4 text-lg md:text-xl font-medium font-barlow">
                        Find jobs. Hire freelancers. Work from anywhere.
                    </p>
                </div>
            </section>

            {/* ✅ How It Works Section */}
            <section className="bg-white text-[#003152] py-16 px-6 md:px-20">
                <h2 className="text-3xl font-bold text-center mb-10 font-barlow">How It Works</h2>
                <div className="grid gap-8 md:grid-cols-4 text-center">
                    <div>
                        <h3 className="text-xl font-semibold mb-2">🔎 Post a Job</h3>
                        <p>Describe the work you need done — it only takes a few minutes.</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-2">👷 Freelancers Apply</h3>
                        <p>Get proposals from talented freelancers ready to work.</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-2">✅ Hire & Collaborate</h3>
                        <p>Choose your freelancer and begin your project confidently.</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-2">💵 Get Paid Securely</h3>
                        <p>Payments are safe and secure for both clients and freelancers.</p>
                    </div>
                </div>
            </section>

            {/* ✅ Why Choose Red Section */}
            <section className="bg-gray-100 text-[#003152] py-16 px-6 md:px-20">
                <h2 className="text-3xl font-bold text-center mb-10 font-barlow">Why Choose Red?</h2>
                <div className="grid gap-8 md:grid-cols-2">
                    <div>
                        <h3 className="text-xl font-semibold mb-2">🚀 Fast Matching</h3>
                        <p>Quickly find the right freelancer or job for your needs.</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-2">🛡️ Secure Payments</h3>
                        <p>Work with peace of mind — your money is protected until delivery.</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-2">📈 Verified Talent</h3>
                        <p>We ensure only quality freelancers and jobs are listed.</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-2">🌍 Global Network</h3>
                        <p>Work with anyone, anywhere — all on one platform.</p>
                    </div>
                </div>
            </section>

            {/* ✅ Call to Action */}
            <section className="bg-[#003152] text-white py-20 text-center px-6">
                <h2 className="text-4xl font-bold mb-6 font-barlow">Ready to Get Started?</h2>
                <p className="mb-8 text-lg">Sign up and start your freelance journey today — or hire talent in minutes.</p>
                <div className="space-x-4">
                    <button
                        onClick={() => navigate("/freelancer/signup")}
                        className="bg-white text-[#003152] font-semibold px-6 py-3 rounded-full hover:bg-gray-200 transition"
                    >
                        Sign Up as Freelancer
                    </button>
                    <button
                        onClick={() => navigate("/clients")}
                        className="bg-[#FF3C3C] text-white font-semibold px-6 py-3 rounded-full hover:bg-red-600 transition"
                    >
                        Post a Job
                    </button>
                </div>
            </section>
        </>
    );
};

export default LandingPage;
