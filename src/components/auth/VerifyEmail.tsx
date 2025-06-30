export default function VerifyEmail() {
    return (
        <div className="max-w-md mx-auto text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
            <p className="text-gray-600 mb-6">
                We've sent a verification link to your email. Please check your inbox and click the link to activate your account.
            </p>
            <p className="text-sm text-gray-400">
                Didn't get the email? Check your spam folder or request a new link from your profile later.
            </p>
        </div>
    );
}
