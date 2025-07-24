import useAdminAuth from "../../hooks/useAdminAuth";
import Spinner from "../../components/Spinner";

interface Props {
    children: React.ReactNode;
}

export default function AdminProtectedRoute({ children }: Props) {
    const { loading } = useAdminAuth();

    if (loading) return <Spinner />;

    // If admin, render children (like <AdminDashboard />)
    return <>{children}</>;
}
