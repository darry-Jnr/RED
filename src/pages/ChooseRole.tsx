import { useNavigate } from "react-router-dom";
import PageMeta from "../components/common/PageMeta";

export default function ChooseRole() {
    const navigate = useNavigate();

    return (
        <>
            <PageMeta
                title="Red | Choose Your Role"
                description="Select your role to begin: freelancer or client on Red platform"
            />

            <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                <div className="space-y-6 text-center">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Join Red</h1>
                    <p className="text-gray-600 dark:text-gray-400">Choose your role to continue</p>

                    <div className="flex justify-center gap-8 mt-6">
                        <button
                            onClick={() => navigate("/freelancer/signup")}
                            className="px-6 py-3 bg-brand-500 text-white rounded-lg hover:bg-brand-600"
                        >
                            I'm a Freelancer
                        </button>

                        <button
                            onClick={() => navigate("/clients/signup")}
                            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
                        >
                            I'm a Client
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
