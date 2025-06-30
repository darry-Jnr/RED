import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const toggleMenu = () => setMobileOpen(!mobileOpen);

    return (
        <nav className="bg-white fixed w-full z-10 shadow-sm">
            <div className="flex justify-between items-center h-16 ml-[10px] mr-[10px] md:ml-[30px] md:mr-[30px]">
                {/* Logo and mobile menu toggle */}
                <div className="flex items-center gap-2">
                    <div className="md:hidden text-[#003152] text-2xl">
                        <button onClick={toggleMenu}>
                            {mobileOpen ? <FaTimes /> : <FaBars />}
                        </button>
                    </div>
                    <div className="text-xl font-bold text-[#003152]">
                        <Link to="/">Red</Link>
                    </div>
                </div>

                {/* Desktop menu */}
                <div className="hidden md:flex items-center gap-4">
                    <ul className="flex gap-3 text-gray-700 font-medium">
                        <li><Link to="/" className="hover:text-[#003152]">Home</Link></li>
                        <li><Link to="/about" className="hover:text-[#003152]">About</Link></li>
                        <li><Link to="/contact" className="hover:text-[#003152]">Contact</Link></li>
                    </ul>
                    <div className="w-px h-5 bg-gray-300 mx-2"></div>
                    <div className="flex items-center gap-2">
                        <Link to="/signin" className="px-3 py-1 font-semibold text-[#003152] hover:text-gray-400">
                            Login
                        </Link>
                        <Link to="/choose-role" className="px-3 py-1 rounded bg-[#003152] text-white hover:bg-opacity-80">
                            Sign Up
                        </Link>
                    </div>
                </div>

                {/* Mobile login/signup buttons */}
                <div className="md:hidden flex gap-2">
                    <Link to="/signin" className="px-3 py-1 font-semibold text-[#003152] hover:text-gray-400">Login</Link>
                    <Link to="/choose-role" className="px-3 py-1 rounded bg-[#003152] text-white hover:bg-opacity-80">Sign Up</Link>
                </div>
            </div>

            {/* Mobile menu dropdown */}
            {mobileOpen && (
                <div className="md:hidden bg-white ml-[10px] mr-[10px] py-3 shadow">
                    <ul className="flex flex-col gap-3 text-gray-700 font-medium">
                        <li><Link to="/" className="hover:text-[#003152]" onClick={toggleMenu}>Home</Link></li>
                        <li><Link to="/about" className="hover:text-[#003152]" onClick={toggleMenu}>About</Link></li>
                        <li><Link to="/contact" className="hover:text-[#003152]" onClick={toggleMenu}>Contact</Link></li>
                    </ul>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
