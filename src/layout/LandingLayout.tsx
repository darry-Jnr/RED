import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import LandingPage from "../pages/LandingPage";
const LandingLayout = () => {
    return (
        <div>
            <Navbar />
            <LandingPage />
            <Footer />
        </div>
    )
}

export default LandingLayout