import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";

interface AddressData {
  country: string;
  cityState: string;
  postalCode: string;
  taxId: string;
}

export default function UserAddressCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<AddressData>({
    country: "",
    cityState: "",
    postalCode: "",
    taxId: "",
  });

  // Load current user and address data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        const docRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          setFormData({
            country: data?.country ?? "",
            cityState: data?.cityState ?? "",
            postalCode: data?.postalCode ?? "",
            taxId: data?.taxId ?? "",
          });
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handle input changes with type safety
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as keyof AddressData;
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save updated address to Firestore
  const handleSave = async () => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);

    // Cast to 'any' to satisfy Firestore updateDoc typing
    await updateDoc(userRef, formData as any);

    closeModal();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Address
            </h4>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs text-gray-500">Country</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {formData.country || "Not set"}
                </p>
              </div>
              <div>
                <p className="mb-2 text-xs text-gray-500">City/State</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {formData.cityState || "Not set"}
                </p>
              </div>
              <div>
                <p className="mb-2 text-xs text-gray-500">Postal Code</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {formData.postalCode || "Not set"}
                </p>
              </div>
              <div>
                <p className="mb-2 text-xs text-gray-500">TAX ID</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {formData.taxId || "Not set"}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={openModal}
            className="flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            Edit
          </button>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full p-4 bg-white rounded-3xl dark:bg-gray-900 lg:p-11">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Edit Address
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Update your address info.
          </p>

          <form className="grid grid-cols-1 gap-x-6 gap-y-5 px-2 lg:grid-cols-2">
            <div>
              <Label>Country</Label>
              <Input
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>City/State</Label>
              <Input
                name="cityState"
                value={formData.cityState}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Postal Code</Label>
              <Input
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>TAX ID</Label>
              <Input
                name="taxId"
                value={formData.taxId}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center gap-3 col-span-2 mt-6 justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
