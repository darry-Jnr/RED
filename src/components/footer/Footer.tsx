
import {
    FaPinterestP,
    FaInstagram,
    FaLinkedinIn,
    FaYoutube,
    FaFacebookF,
    FaArrowUp,
} from 'react-icons/fa';

const Footer = () => {
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <footer className="bg-black text-gray-400 px-4 md:px-10 pt-10">
            {/* Top row */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

                {/* Left - Logo */}
                <h1 className="text-white text-xl font-bold">Red</h1>

                {/* Center - Nav Links */}
                <ul className="flex flex-wrap justify-center gap-6 text-sm">
                    <li><a href="#" className="hover:text-white">Home</a></li>
                    <li><a href="#" className="hover:text-white">About</a></li>
                    <li><a href="#" className="hover:text-white">Contact</a></li>
                </ul>

                {/* Right - Socials + Back to top */}
                <div className="flex flex-col items-start md:items-end gap-4">
                    <div className="flex gap-4 text-lg">
                        <a href="#" className="hover:text-white"><FaPinterestP /></a>
                        <a href="#" className="hover:text-white"><FaInstagram /></a>
                        <a href="#" className="hover:text-white"><FaLinkedinIn /></a>
                        <a href="#" className="hover:text-white"><FaYoutube /></a>
                        <a href="#" className="hover:text-white"><FaFacebookF /></a>
                        <button onClick={scrollToTop} className="hover:text-white"><FaArrowUp /></button>
                    </div>
                    <div className="flex gap-4 text-sm">
                        <a href="#" className="hover:text-white">Privacy Policy</a>
                        <a href="#" className="hover:text-white">Terms of Service</a>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <hr className="border-gray-700 my-6" />

            {/* Bottom text */}
            <p className="text-center text-xs text-gray-500 pb-6">
                © 2025 Red Freelance Platform. Built with love and clean design.
            </p>
        </footer>
    );
};

export default Footer;
