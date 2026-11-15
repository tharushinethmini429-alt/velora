import { useEffect, useState } from "react";
import { Search, Mail, Users, CalendarDays, RefreshCw } from "lucide-react";
import AdminLayout from "../layouts/AdminLayout";

type Subscriber = {
    _id: string;
    email: string;
    subscribedAt: string;
};

function AdminNewsletter() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const fetchSubscribers = async () => {
        setLoading(true);
        setError("");

        try {
            const token = sessionStorage.getItem("velora_admin_token");
            if (!token) {
                throw new Error("Please log in again.");
            }

            const response = await fetch(
                "http://localhost:5000/api/newsletter",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to load subscribers.");
            }

            setSubscribers(data);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Could not load subscribers."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const filteredSubscribers = subscribers.filter((subscriber) =>
        subscriber.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout>
            <main className="flex-1 p-6 md:p-10">
                <header className="mb-10">
                    <p className="text-sm text-[#9A8574]">Administration / Store Management</p>
                    <h1 className="font-serif text-3xl text-[#302721] mt-2">Newsletter Subscribers</h1>
                    <p className="text-sm text-[#81766C] mt-2">View and manage customers subscribed to Velora updates.</p>
                </header>

                <section className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                    <div className="bg-white rounded-2xl p-6 border border-[#EDE5DB] shadow-sm">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-[#81766C]">Total Subscribers</p>
                                <h2 className="text-3xl font-semibold text-[#302721] mt-3">{subscribers.length}</h2>
                            </div>
                            <div className="bg-[#F5EEE7] p-3 rounded-xl">
                                <Users className="text-[#A17A50]" size={23} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-[#EDE5DB] shadow-sm">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-[#81766C]">Latest Subscription</p>
                                <h2 className="text-lg font-semibold text-[#302721] mt-3">
                                    {subscribers.length > 0
                                        ? new Date(
                                              subscribers[0].subscribedAt
                                          ).toLocaleDateString()
                                        : "No subscriptions"}
                                </h2>
                            </div>
                            <div className="bg-[#F5EEE7] p-3 rounded-xl">
                                <CalendarDays className="text-[#A17A50]" size={23}/>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-white rounded-2xl p-6 border border-[#EDE5DB] shadow-sm">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                        <div>
                            <h2 className="font-serif text-xl text-[#302721]">All Subscribers</h2>
                            <p className="text-sm text-[#81766C] mt-1">{subscribers.length} subscribers in your store</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A8574]"/>
                                <input type="text" placeholder="Search email..." value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full sm:w-64 pl-10 pr-4 py-3 border border-[#EDE5DB] rounded-lg text-sm outline-none focus:border-[#B18A60]"/>
                            </div>
                            <button type="button" onClick={fetchSubscribers}
                            className="flex items-center justify-center gap-2 px-4 py-3 border border-[#EDE5DB] rounded-lg text-sm text-[#81766C] hover:bg-[#F5EEE7]">
                            <RefreshCw size={16} />
                            Refresh
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <p className="text-sm text-[#81766C] py-12 text-center">Loading subscribers...</p>
                    ) : error ? (
                        <p className="text-sm text-red-600 py-12 text-center">{error}</p>
                    ) : filteredSubscribers.length === 0 ? (
                        <div className="text-center py-12">
                            <Mail size={36} className="mx-auto text-[#B18A60] mb-3"/>
                            <p className="text-[#302721] font-medium">
                                {search
                                    ? "No matching subscribers found."
                                    : "No subscribers yet."}
                            </p>
                            <p className="text-sm text-[#9A8574] mt-2">
                                {search
                                    ? "Try another email address."
                                    : "New newsletter subscribers will appear here."}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-[#EDE5DB] text-xs uppercase tracking-wider text-[#9A8574]">
                                        <th className="py-4 pr-4">Email Address</th>
                                        <th className="py-4 px-4">Subscription Date</th>
                                        <th className="py-4 pl-4">Status</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredSubscribers.map((subscriber) => (
                                        <tr key={subscriber._id} className="border-b border-[#F0EBE5] last:border-0">
                                            <td className="py-4 pr-4">
                                                <p className="flex items-center gap-2 text-sm font-medium text-[#302721]">
                                                    <Mail size={16} className="text-[#A17A50]"/>
                                                    {subscriber.email}
                                                </p>
                                            </td>

                                            <td className="py-4 px-4 text-sm text-[#81766C]">
                                                {new Date(
                                                    subscriber.subscribedAt
                                                ).toLocaleString()}
                                            </td>

                                            <td className="py-4 pl-4">
                                                <span className="inline-block px-3 py-1 rounded-full bg-[#F5EEE7] text-[#8E6945] text-xs font-medium">
                                                    Subscribed
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </main>
        </AdminLayout>
    );
}

export default AdminNewsletter;
