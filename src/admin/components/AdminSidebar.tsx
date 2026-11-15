import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Heart,
    Settings,
    LogOut,
    Users,
    Activity,
    Mail,
    MessageSquare,
} from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";

function AdminSidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    
    const menuItems = [
        { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
        { name: "Products", icon: Package, path: "/admin/products" },
        { name: "Orders", icon: ShoppingCart, path: "/admin/orders" },
        { name: "Wishlist", icon: Heart, path: "/admin/wishlist" },
        { name: "Customers", icon: Users, path: "/admin/customers" },
        { name: "Activity Logs", icon: Activity, path: "/admin/activity-logs" },
        { name: "Newsletter", icon: Mail, path: "/admin/newsletter" },
        { name: "Contact Messages", icon: MessageSquare, path: "/admin/contact-messages" },
        { name: "Settings", icon: Settings, path: "/admin/settings" },
    ];

    const handleLogout = async () => {
    const token = sessionStorage.getItem("velora_admin_token");

    try {
        if (token) {
            await fetch("http://localhost:5000/api/admin/logout", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        }
    } catch (error) {
        console.error("Logout logging failed:", error);
    } finally {
        sessionStorage.removeItem("velora_admin_token");
        navigate("/admin/login");
    }
};
    
    return (
    <aside className="w-64 min-h-screen bg-[#252321] text-white p-6 flex flex-col shrink-0">
        <h1 className="font-serif text-3xl tracking-wide mb-12">Velora<span className="text-[#B18A60]">.</span></h1>
        <p className="text-xs uppercase tracking-[0.2em] text-[#A99B8C] mb-5">Main Menu</p>
        <nav className="space-y-2">
            {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                <button key={item.name} onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${
                    isActive
                    ? "bg-[#B18A60] text-white"
                    : "text-[#D2C9BF] hover:bg-white/10"
                }`}>
                    <Icon size={18} />{item.name}
                </button>
                );
            })}
        </nav>
        
        <button onClick={handleLogout} className="mt-auto flex items-center gap-3 px-4 py-3 text-sm text-[#D2C9BF] hover:text-white hover:bg-white/10 rounded-lg">
        <LogOut size={18} />Logout</button>
    </aside>
);
}

export default AdminSidebar;
