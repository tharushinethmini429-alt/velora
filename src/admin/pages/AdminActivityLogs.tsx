import { useEffect, useState } from "react";
import { Activity, Search, RefreshCw } from "lucide-react";
import AdminLayout from "../layouts/AdminLayout";

type AdminActivity = {
    _id: string;
    action: string;
    description: string;
    ipAddress?: string;
    createdAt: string;
    adminId?: {
        name?: string;
        email?: string;
    } | string;
};

function AdminActivityLogs() {
    const [activities, setActivities] = useState<AdminActivity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const token = sessionStorage.getItem("velora_admin_token");
                
                if (!token) {
                    throw new Error("Please log in again.");
                }
                const response = await fetch(
                    "http://localhost:5000/api/admin/activities",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || "Failed to load activities.");
                }
                setActivities(data);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "Something went wrong."
                );
            } finally {
                setLoading(false);
            }
        };
        fetchActivities();
    }, []);

    const filteredActivities = activities.filter((activity) => {
    const adminName =
        typeof activity.adminId === "object"
            ? activity.adminId?.name || activity.adminId?.email || ""
            : "";
            
            return (
                activity.action.toLowerCase().includes(search.toLowerCase()) ||
                activity.description.toLowerCase().includes(search.toLowerCase()) ||
                activity.ipAddress?.toLowerCase().includes(search.toLowerCase()) ||
                adminName.toLowerCase().includes(search.toLowerCase())
            );
        });
 

    return (
        <AdminLayout>
            <main className="flex-1 p-6 md:p-10">
                <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
                    <div>
                        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[#9A8574]">Administration / Store Management</p>
                        <h1 className="font-serif text-3xl text-[#302721]">Admin Activity Logs</h1>
                        <p className="mt-2 text-sm text-[#81766C]">Monitor important actions performed in your Velora store.</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button type="button" onClick={() => window.location.reload()}
                        className="flex items-center gap-2 rounded-lg border border-[#EDE5DB] px-4 py-3 text-sm text-[#302721] transition hover:bg-[#FAF8F5]">
                            <RefreshCw size={16} />Refresh</button>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9A8574]" />
                            <input type="text" placeholder="Search activities..." value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-lg border border-[#EDE5DB] bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-[#A17A50] md:w-64"/>
                        </div>
                    </div>
                </div>

                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-[#EDE5DB] bg-white p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[#81766C]">Total Activities</p>
                                <h2 className="mt-2 text-3xl font-semibold text-[#302721]">{activities.length}</h2>
                            </div>
                            <Activity className="h-8 w-8 text-[#A17A50]" />
                        </div>
                    </div>
                    
                    <div className="rounded-xl border border-[#EDE5DB] bg-white p-5">
                        <div>
                            <p className="text-sm text-[#81766C]">Showing Results</p>
                            <h2 className="mt-2 text-3xl font-semibold text-[#302721]">{filteredActivities.length}</h2>
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-[#EDE5DB] bg-white">
                    <div className="border-b border-[#EDE5DB] px-6 py-5">
                        <h2 className="font-serif text-xl text-[#302721]">Recent Activities</h2>
                        <p className="mt-1 text-sm text-[#81766C]">Latest administrative actions in your store.</p>
                    </div>
                    
                    {loading ? (
                        <p className="p-8 text-center text-sm text-[#81766C]">Loading activity records...</p>
                    ) : error ? (
                    <p className="p-8 text-center text-sm text-red-600">{error}</p>
                ) : filteredActivities.length === 0 ? (
                <p className="p-8 text-center text-sm text-[#81766C]">No activity records found.</p>
            ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-[#FAF8F5] text-[#81766C]">
                        <tr>
                            <th className="px-6 py-4 font-medium">Activity</th>
                            <th className="px-6 py-4 font-medium">Description</th>
                            <th className="px-6 py-4 font-medium">Admin</th>
                            <th className="px-6 py-4 font-medium">IP Address</th>
                            <th className="px-6 py-4 font-medium">Date & Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EDE5DB]">
                        {filteredActivities.map((item) => (
                            <tr key={item._id} className="hover:bg-[#FAF8F5]">
                                <td className="px-6 py-4 font-medium text-[#302721]">{item.action.replaceAll("_", " ")}</td>
                                <td className="px-6 py-4 text-[#81766C]">{item.description}</td>
                                <td className="px-6 py-4 text-[#81766C]">
                                    {typeof item.adminId === "object"
                                    ? item.adminId?.name || item.adminId?.email || "Admin"
                                    : "Admin"}
                                </td>
                                <td className="px-6 py-4 text-[#81766C]">{item.ipAddress || "Unknown"}</td>
                                <td className="whitespace-nowrap px-6 py-4 text-[#81766C]">{new Date(item.createdAt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>


            </main>
        </AdminLayout>
    );
}

export default AdminActivityLogs;