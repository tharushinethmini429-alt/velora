import { useEffect, useState } from "react";
import {
    Search,
    Users,
    CalendarDays,
    RefreshCw,
    MessageSquare,
} from "lucide-react";
import AdminLayout from "../layouts/AdminLayout";

type ContactMessage = {
    _id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: "Unread" | "Read";
    submittedAt: string;
};

function AdminContactMessages() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    const fetchMessages = async () => {
        setLoading(true);
        setError("");

        try {
            const token = sessionStorage.getItem("velora_admin_token");

            if (!token) {
                throw new Error("Please log in again.");
            }

            const response = await fetch(
                "http://localhost:5000/api/contact",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to load messages.");
            }

            setMessages(data);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Could not load contact messages."
            );
        } finally {
            setLoading(false);
        }
    };

    const updateMessageStatus = async (
    id: string,
    status: "Read" | "Unread"
) => {
    try {
        const token = sessionStorage.getItem("velora_admin_token");

        const response = await fetch(
            `http://localhost:5000/api/contact/${id}/status`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to update status.");
        }

        setMessages((previous) =>
            previous.map((item) =>
                item._id === id ? data : item
            )
        );
    } catch (error) {
        alert(
            error instanceof Error
                ? error.message
                : "Could not update message status."
        );
    }
};

    useEffect(() => {
        fetchMessages();
    }, []);

    const filteredMessages = messages.filter((item) =>
        `${item.name} ${item.email} ${item.subject} ${item.message}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <AdminLayout>
            <main className="flex-1 p-6 md:p-10">
                <header className="mb-10">
                    <p className="text-sm text-[#9A8574]">Administration / Store Management</p>
                    <h1 className="font-serif text-3xl text-[#302721] mt-2">Contact Messages</h1>
                    <p className="text-sm text-[#81766C] mt-2">View messages and enquiries sent by Velora customers.</p>
                </header>

                <section className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                    <div className="bg-white rounded-2xl p-6 border border-[#EDE5DB] shadow-sm">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-[#81766C]">Total Messages</p>
                                <h2 className="text-3xl font-semibold text-[#302721] mt-3">{messages.length}</h2>
                            </div>
                            <div className="bg-[#F5EEE7] p-3 rounded-xl">
                                <Users className="text-[#A17A50]" size={23} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-[#EDE5DB] shadow-sm">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-[#81766C]">Latest Message</p>
                                <h2 className="text-lg font-semibold text-[#302721] mt-3">
                                    {messages.length > 0
                                        ? new Date(
                                              messages[0].submittedAt
                                          ).toLocaleDateString()
                                        : "No messages"}
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
                            <h2 className="font-serif text-xl text-[#302721]">All Contact Messages</h2>
                            <p className="text-sm text-[#81766C] mt-1">{messages.length} messages in your store</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A8574]"/>
                                <input type="text" placeholder="Search messages..." value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full sm:w-64 pl-10 pr-4 py-3 border border-[#EDE5DB] rounded-lg text-sm outline-none focus:border-[#B18A60]"/>
                            </div>

                            <button type="button" onClick={fetchMessages}
                            className="flex items-center justify-center gap-2 px-4 py-3 border border-[#EDE5DB] rounded-lg text-sm text-[#81766C] hover:bg-[#F5EEE7]">
                            <RefreshCw size={16} />
                            Refresh
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <p className="text-sm text-[#81766C] py-12 text-center">Loading messages...</p>
                    ) : error ? (
                        <p className="text-sm text-red-600 py-12 text-center">{error}</p>
                    ) : filteredMessages.length === 0 ? (
                        <div className="text-center py-12">
                            <MessageSquare size={36} className="mx-auto text-[#B18A60] mb-3"/>
                            <p className="text-[#302721] font-medium">
                                {search
                                    ? "No matching messages found."
                                    : "No contact messages yet."}
                            </p>
                            <p className="text-sm text-[#9A8574] mt-2">
                                {search
                                    ? "Try another search."
                                    : "Customer enquiries will appear here."}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-[#EDE5DB] text-xs uppercase tracking-wider text-[#9A8574]">
                                        <th className="py-4 pr-4">Customer</th>
                                        <th className="py-4 px-4">Subject</th>
                                        <th className="py-4 px-4">Message</th>
                                        <th className="py-4 px-4">Date</th>
                                        <th className="py-4 pl-4">Status / Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredMessages.map((item) => (
                                        <tr key={item._id} className="border-b border-[#F0EBE5] last:border-0">
                                            <td className="py-4 pr-4">
                                                <p className="text-sm font-medium text-[#302721]">{item.name}</p>
                                                <p className="text-xs text-[#81766C] mt-1">{item.email}</p>
                                            </td>

                                            <td className="py-4 px-4 text-sm text-[#302721]">{item.subject}</td>

                                            <td className="py-4 px-4 text-sm text-[#81766C] max-w-xs">
                                                <p className="whitespace-pre-wrap break-words">{item.message}</p>
                                            </td>

                                            <td className="py-4 px-4 text-sm text-[#81766C] whitespace-nowrap">
                                                {new Date(
                                                    item.submittedAt
                                                ).toLocaleString()}
                                            </td>

                                            <td className="py-4 pl-4">
                                                <div className="flex flex-col items-start gap-2">
                                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                                        item.status === "Unread"
                                                        ? "bg-[#FCECE8] text-[#A34F3D]"
                                                        : "bg-[#F5EEE7] text-[#8E6945]"
                                                    }`}>
                                                        {item.status}
                                                                                                        </span>

                                                    <button type="button" onClick={() =>
                                                    updateMessageStatus(
                                                        item._id,
                                                        item.status === "Unread" ? "Read" : "Unread"
                                                    )
                                                }
                                                className="text-xs font-medium text-[#A17A50] hover:underline">
                                                    {item.status === "Unread" ? "Mark as Read" : "Mark as Unread"}
                                                    </button>
                                                </div>
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

export default AdminContactMessages;
