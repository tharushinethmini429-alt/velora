import { useEffect, useState } from "react";
import { Search, Package, Eye } from "lucide-react";
import AdminLayout from "../layouts/AdminLayout";

type Order = {
    _id: string;
    customerName: string;
    email: string;
    phone: string;
    address: string;
    items: {
        productId: string;
        name: string;
        price: number;
        quantity: number;
    }[];
    totalAmount: number;
    paymentMethod: string;
    status: string;
    createdAt: string;
};

function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = sessionStorage.getItem("velora_admin_token");
                if (!token) {
                    throw new Error("Please log in again.");
                }
                const response = await fetch(
                    "http://localhost:5000/api/orders",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || "Failed to load orders.");
                }
                setOrders(data);
            } catch (error) {
                setError(
                    error instanceof Error
                    ? error.message
                    : "Could not load orders."
                );
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const filteredOrders = orders.filter((order) =>
        `${order.customerName} ${order.email} ${order._id}`
    .toLowerCase()
    .includes(search.toLowerCase())
);

const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    try {
        const token = sessionStorage.getItem("velora_admin_token");
        if (!token) {
            throw new Error("Please log in again.");
        }
        const response = await fetch(
            `http://localhost:5000/api/orders/${selectedOrder._id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    status: selectedOrder.status,
                }),
            }
        );
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to update order.");
        }
        setOrders((previousOrders) =>
            previousOrders.map((order) =>
                order._id === data._id ? data : order
            )
        );
        setSelectedOrder(data);
        alert("Order status updated successfully!");
    } catch (error) {
        alert(
            error instanceof Error
                ? error.message
                : "Something went wrong."
        );
    }
};

return (
<AdminLayout>
    <header className="mb-10">
        <p className="text-sm text-[#9A8574]">Administration / Store Management</p>
        <h1 className="font-serif text-3xl text-[#302721] mt-2">Order Management</h1>
        <p className="text-sm text-[#81766C] mt-2">View and manage customer orders here.</p>
        </header>
        
        <section className="bg-white rounded-2xl p-6 border border-[#EDE5DB] shadow-sm">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                    <h2 className="font-serif text-xl text-[#302721]">All Orders</h2>
                    <p className="text-sm text-[#81766C] mt-1">{orders.length} orders in your store</p>
                </div>
                
                <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A8574]"/>
                    <input type="text" placeholder="Search orders..." value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:w-64 pl-10 pr-4 py-3 border border-[#EDE5DB] rounded-lg text-sm outline-none focus:border-[#B18A60]"/>
                </div>

                {loading ? (
                    <p className="text-sm text-[#81766C] py-8 text-center">Loading orders...</p>
                ) : error ? (
                <p className="text-sm text-red-600 py-8 text-center">{error}</p>
            ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
                <Package size={36} className="mx-auto text-[#B18A60] mb-3"/>
                <p className="text-[#302721] font-medium">{search ? "No matching orders found." : "No orders yet."}</p>
                <p className="text-sm text-[#9A8574] mt-2">
                    {search
                    ? "Try another search."
                    : "Customer orders will appear here."}
                </p>
            </div>
        ) : (
        <div>
            <div className="overflow-x-auto">
    <table className="w-full text-left">
        <thead>
            <tr className="border-b border-[#EDE5DB] text-xs uppercase tracking-wider text-[#9A8574]">
                <th className="py-4 pr-4">Order ID</th>
                <th className="py-4 px-4">Customer</th>
                <th className="py-4 px-4">Date</th>
                <th className="py-4 px-4">Total</th>
                <th className="py-4 px-4">Payment</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 pl-4">Actions</th>
            </tr>
        </thead>

        <tbody>
            {filteredOrders.map((order) => (
                <tr key={order._id} className="border-b border-[#F0EBE5] last:border-0">
                    <td className="py-4 pr-4 text-sm font-medium text-[#302721]">#{order._id.slice(-6).toUpperCase()}</td>
                    <td className="py-4 px-4">
                        <p className="text-sm font-medium text-[#302721]">{order.customerName}</p>
                        <p className="text-xs text-[#9A8574]">{order.email}</p>
                    </td>
                    <td className="py-4 px-4 text-sm text-[#81766C]">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 px-4 text-sm font-medium text-[#302721]">${order.totalAmount.toFixed(2)}</td>
                    <td className="py-4 px-4 text-sm text-[#81766C]">{order.paymentMethod}</td>
                    
                    <td className="py-4 px-4">
                        <span className="text-xs px-3 py-1 rounded-full bg-amber-50 text-amber-700">{order.status}</span>
                    </td>
                    
                    <td className="py-4 pl-4">
                        <button type="button" onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-2 text-sm text-[#B18A60] hover:text-[#8E6945]">
                            <Eye size={16} />
                            View
                        </button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
</div>
    )}
    </div>

    {selectedOrder && (
    <div className="mt-8 bg-[#FAF8F5] border border-[#EDE5DB] rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-xl text-[#302721]">Order Details</h2>
            <button type="button" onClick={() => setSelectedOrder(null)}
            className="text-sm text-[#9A8574] hover:text-[#302721]">
                Close
            </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
                <h3 className="text-sm font-semibold text-[#302721] mb-3">Customer Information</h3>
                <p className="text-sm text-[#81766C] mb-2">Name: {selectedOrder.customerName}</p>
                <p className="text-sm text-[#81766C] mb-2">Email: {selectedOrder.email}</p>
                <p className="text-sm text-[#81766C] mb-2">Phone: {selectedOrder.phone}</p>
                <p className="text-sm text-[#81766C]">Address: {selectedOrder.address}</p>
            </div>
            
            <div>
                <h3 className="text-sm font-semibold text-[#302721] mb-3">Payment Information</h3>
                <p className="text-sm text-[#81766C] mb-2">Method: {selectedOrder.paymentMethod}</p>
                <p className="text-sm text-[#81766C]">Total: ${selectedOrder.totalAmount.toFixed(2)}</p>
            </div>

            <div className="border-t border-[#EDE5DB] pt-6">
                <h3 className="text-sm font-semibold text-[#302721] mb-4">Ordered Products</h3>
                <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                        <div key={`${item.productId}-${index}`} className="flex justify-between items-center text-sm">
                            <div>
                                <p className="font-medium text-[#302721]">{item.name}</p>
                                <p className="text-xs text-[#9A8574]">${item.price.toFixed(2)} × {item.quantity}</p>
                            </div>
                            <p className="font-medium text-[#302721]">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="border-t border-[#EDE5DB] pt-6 mt-6">
                <label className="block text-sm font-semibold text-[#302721] mb-3">Update Order Status</label>
                <select value={selectedOrder.status} onChange={(e) =>
                setSelectedOrder({
                    ...selectedOrder,
                    status: e.target.value,
                })
            }
            className="w-full md:w-64 p-3 border border-[#EDE5DB] rounded-lg bg-white text-sm">
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
            </select>
            <button type="button" onClick={handleUpdateStatus} className="mt-4 px-5 py-3 bg-[#B18A60] text-white rounded-lg text-sm hover:bg-[#8E6945]">Save Status</button>
        </div>



        </div>
    </div>
)}

    </section>
</AdminLayout>
);
}

export default AdminOrders;