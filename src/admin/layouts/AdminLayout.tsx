import type { ReactNode } from "react";
import AdminSidebar from "../components/AdminSidebar";

type AdminLayoutProps = {
    children: ReactNode;
};

function AdminLayout({ children }: AdminLayoutProps) {
    return (
    <div className="min-h-screen bg-[#F8F6F2] flex">
        <AdminSidebar />
        <main className="flex-1 min-w-0 p-6 md:p-10">
            {children}
        </main>
    </div>
    );
}

export default AdminLayout;
