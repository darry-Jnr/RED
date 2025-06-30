import { SidebarProvider, useSidebar } from "../../context/SidebarContext";
import { Outlet } from "react-router-dom"; // ✅ Use react-router-dom here!
import ClientsHeader from "./ClientsHeader";
import ClientsSidebar from "./ClientsSidebar";
import Backdrop from "../Freelancer/Backdrop"; // assuming Backdrop is shared

const LayoutContent: React.FC = () => {
    const { isExpanded, isHovered, isMobileOpen } = useSidebar();

    return (
        <div className="min-h-screen xl:flex">
            {/* Sidebar */}
            <div>
                <ClientsSidebar />
                <Backdrop />
            </div>

            {/* Main Content */}
            <div
                className={`flex-1 transition-all duration-300 ease-in-out ${isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
                    } ${isMobileOpen ? "ml-0" : ""}`}
            >
                <ClientsHeader />
                <div className="p-4 mx-auto max-w-screen-2xl md:p-6">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

const ClientsLayout: React.FC = () => {
    return (
        <SidebarProvider>
            <LayoutContent />
        </SidebarProvider>
    );
};

export default ClientsLayout;
