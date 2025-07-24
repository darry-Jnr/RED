import { SidebarProvider, useSidebar } from "../../context/SidebarContext";
import { Outlet } from "react-router-dom"; // ✅ Use react-router-dom here!
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import Backdrop from "../Freelancer/Backdrop"; // assuming Backdrop is shared

const LayoutContent: React.FC = () => {
    const { isExpanded, isHovered, isMobileOpen } = useSidebar();

    return (
        <div className="min-h-screen xl:flex">
            {/* Sidebar */}
            <div>
                <AdminSidebar />
                <Backdrop />
            </div>

            {/* Main Content */}
            <div
                className={`flex-1 transition-all duration-300 ease-in-out ${isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
                    } ${isMobileOpen ? "ml-0" : ""}`}
            >
                <AdminHeader />
                <div className="p-4 mx-auto max-w-screen-2xl md:p-6">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

const AdminLayout: React.FC = () => {
    return (
        <SidebarProvider>
            <LayoutContent />
        </SidebarProvider>
    );
};

export default AdminLayout;
