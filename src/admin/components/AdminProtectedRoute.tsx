import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

type AdminProtectedRouteProps = {
    children: React.ReactNode;
};

function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    
    useEffect(() => {
        const verifyAdmin = async () => {
            const token = sessionStorage.getItem("velora_admin_token");
            
            if (!token) {
                setIsAuthenticated(false);
                return;
            }
            try {
                const response = await fetch(
                    "http://localhost:5000/api/admin/profile",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    sessionStorage.removeItem("velora_admin_token");
                    setIsAuthenticated(false);
                    return;
                }
                setIsAuthenticated(true);
                } catch {
                    setIsAuthenticated(false);
                }
            };
        verifyAdmin();
    }, []);
    
    if (isAuthenticated === null) {
        return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8F6F2]">
            <p className="text-[#8B735D]">Verifying admin access...</p>
        </div>
        );
    }
    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }
    return <>{children}</>;
}
export default AdminProtectedRoute;
