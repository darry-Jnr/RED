import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../../../firebase/firebaseConfig";
import PageMeta from "../../../components/common/PageMeta";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const budgetOptions = [5000, 10000, 25000, 50000, 100000];

const PostJob = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedBudget, setSelectedBudget] = useState<number | null>(null);
    const [customBudget, setCustomBudget] = useState("");
    const [images, setImages] = useState<string[]>([]);

    const navigate = useNavigate();

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const selectedFiles = Array.from(files);

        if (selectedFiles.length + images.length > 3) {
            toast.error("You can only upload up to 3 images.");
            return;
        }

        const imagePromises = selectedFiles.map((file) => {
            return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        });

        Promise.all(imagePromises)
            .then((base64Images) => {
                setImages((prev) => [...prev, ...base64Images]);
            })
            .catch(() => toast.error("Failed to upload images."));
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handlePostJob = async (e: React.FormEvent) => {
        e.preventDefault();

        const user = auth.currentUser;
        if (!user) return toast.error("You must be logged in to post a job.");
        if (!title || !description || (!selectedBudget && !customBudget.trim())) {
            return toast.error("Please complete all required fields.");
        }

        const budget =
            selectedBudget !== null
                ? selectedBudget
                : customBudget.trim() !== ""
                    ? parseFloat(customBudget)
                    : null;

        if (isNaN(budget!) || budget! <= 0) {
            return toast.error("Please enter a valid budget.");
        }

        try {
            const docRef = await addDoc(collection(db, "jobs"), {
                title,
                description,
                budget,
                images,
                clientId: user.uid,
                status: "pending",
                isPaid: false,
                createdAt: serverTimestamp(),
            });

            toast.success("Job posted successfully!");
            navigate(`/clients/payment/${docRef.id}`, {
                state: { amount: 100 },
            });

            setTitle("");
            setDescription("");
            setSelectedBudget(null);
            setCustomBudget("");
            setImages([]);
        } catch (err) {
            console.error("❌ Error posting job:", err);
            toast.error("Failed to post job.");
        }
    };

    return (
        <>
            <PageMeta title="Post Job | Red" description="Post a freelance task" />
            <div className="max-w-3xl mx-auto p-6">
                <h1 className="text-3xl font-semibold mb-6 text-[#003152]">Post a New Job</h1>
                <form
                    onSubmit={handlePostJob}
                    className="bg-white rounded-lg shadow-md p-6 space-y-6"
                >
                    {/* Job Info */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Job Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            rows={5}
                            className="w-full px-4 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Budget */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Budget (₦)</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {budgetOptions.map((amount) => (
                                <button
                                    type="button"
                                    key={amount}
                                    onClick={() => {
                                        setSelectedBudget(amount);
                                        setCustomBudget("");
                                    }}
                                    className={`border rounded-md px-4 py-2 text-center ${selectedBudget === amount
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 hover:bg-gray-200"
                                        }`}
                                >
                                    ₦{amount.toLocaleString()}
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedBudget(null);
                                }}
                                className={`border rounded-md px-4 py-2 text-center ${selectedBudget === null && customBudget === ""
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 hover:bg-gray-200"
                                    }`}
                            >
                                To Be Discussed
                            </button>
                        </div>

                        <input
                            type="number"
                            placeholder="Or enter custom amount"
                            value={customBudget}
                            onChange={(e) => {
                                setCustomBudget(e.target.value);
                                setSelectedBudget(null);
                            }}
                            className="mt-3 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Images */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Upload Image(s) <span className="text-sm text-gray-500">(max 3)</span>
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="w-full mb-2"
                            disabled={images.length >= 3}
                        />
                        {images.length > 0 && (
                            <div className="flex flex-wrap gap-4 mt-3">
                                {images.map((img, index) => (
                                    <div key={index} className="relative w-24 h-24">
                                        <img
                                            src={img}
                                            alt={`upload-${index}`}
                                            className="w-full h-full object-cover rounded-md border"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-1 text-sm"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit */}
                    <div className="text-right">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded"
                        >
                            Post Job
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default PostJob;
