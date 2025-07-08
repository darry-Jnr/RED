import { auth } from "../firebase/firebaseConfig";

export const payWithPaystack = (
    amount: number,
    onSuccess: (reference: string) => void
) => {
    const handler = (window as any).PaystackPop.setup({
        key: "pk_test_93fb7906f7dc298cc521dabbe6f8d22ff9049cf7",
        email: auth.currentUser?.email,
        amount: amount * 100, // kobo
        currency: "NGN",
        ref: `${Date.now()}`,
        callback: function (response: any) {
            console.log("✅ Payment complete!", response);
            onSuccess(response.reference);
        },
        onClose: function () {
            console.log("❌ Payment window closed.");
        },
    });

    handler.openIframe();
};
