import { useEffect, useState } from "react";
import {
    Search,
    Users,
    ShoppingBag,
    DollarSign,
    Eye,
    X,
    Mail,
    Phone,
    MapPin,
    CalendarDays,
} from "lucide-react";
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

type Customer = {
    name: string;
    email: string;
    phone: string;
    address: string;
    totalOrders: number;
    totalSpent: number;
    orders: Order[];
};

function AdminCustomers() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    
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
                    throw new Error(
                        data.message || "Failed to load customers."
                    );
                }

                setOrders(data);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Could not load customers."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // Group orders belonging to the same customer.
    const customerMap = new Map<string, Customer>();

    orders.forEach((order) => {
        const email = order.email.toLowerCase().trim();

        if (!email) return;

        const existingCustomer = customerMap.get(email);

        if (existingCustomer) {
            existingCustomer.totalOrders += 1;
            existingCustomer.totalSpent += order.totalAmount;
            existingCustomer.orders.push(order);
        } else {
            customerMap.set(email, {
                name: order.customerName,
                email,
                phone: order.phone,
                address: order.address,
                totalOrders: 1,
                totalSpent: order.totalAmount,
                orders: [order],
            });
        }
    });

    const customers = Array.from(customerMap.values());

    const filteredCustomers = customers.filter((customer) =>
        `${customer.name} ${customer.email} ${customer.phone}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const totalRevenue = orders.reduce(
        (total, order) => total + order.totalAmount,
        0
    );

    return (
        <AdminLayout>
            <main className="flex-1 p-6 md:p-10">
                <header className="mb-10">
                    <p className="text-sm text-[#9A8574]">Administration / Store Management</p>
                    <h1 className="font-serif text-3xl text-[#302721] mt-2">Customer Management</h1>
                    <p className="text-sm text-[#81766C] mt-2">Understand and manage your Velora customers.</p>
                </header>

                {/* Customer Statistics */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                    <div className="bg-white rounded-2xl p-6 border border-[#EDE5DB] shadow-sm">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-[#81766C]">Total Customers</p>
                                <h2 className="text-3xl font-semibold text-[#302721] mt-3">{customers.length}</h2>
                            </div>
                            <div className="bg-[#F5EEE7] p-3 rounded-xl">
                                <Users className="text-[#A17A50]" size={23} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-[#EDE5DB] shadow-sm">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-[#81766C]">Total Orders</p>
                                <h2 className="text-3xl font-semibold text-[#302721] mt-3">{orders.length}</h2>
                            </div>
                            <div className="bg-[#F5EEE7] p-3 rounded-xl">
                                <ShoppingBag className="text-[#A17A50]" size={23} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-[#EDE5DB] shadow-sm">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-[#81766C]">Customer Spending</p>
                                <h2 className="text-3xl font-semibold text-[#302721] mt-3">${totalRevenue.toFixed(2)}</h2>
                            </div>
                            <div className="bg-[#F5EEE7] p-3 rounded-xl">
                                <DollarSign className="text-[#A17A50]" size={23}/>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Customer Table */}
                <section className="bg-white rounded-2xl p-6 border border-[#EDE5DB] shadow-sm">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                        <div>
                            <h2 className="font-serif text-xl text-[#302721]">All Customers</h2>
                            <p className="text-sm text-[#81766C] mt-1">{customers.length} customers in your store</p>
                        </div>

                        <div className="relative">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A8574]"/>

                            <input type="text" placeholder="Search customers..." value={search} onChange={(e) => setSearch(e.target.value)}
                            className="w-full md:w-72 pl-10 pr-4 py-3 border border-[#EDE5DB] rounded-lg text-sm outline-none focus:border-[#B18A60]"/>
                        </div>
                    </div>

                    {loading ? (
                        <p className="text-sm text-[#81766C] py-12 text-center"> Loading customers...</p>
                    ) : error ? (
                        <p className="text-sm text-red-600 py-12 text-center">
                            {error}
                        </p>
                    ) : filteredCustomers.length === 0 ? (
                        <div className="text-center py-12">
                            <Users size={36} className="mx-auto text-[#B18A60] mb-3"/>
                            <p className="text-[#302721] font-medium">
                                {search
                                    ? "No matching customers found."
                                    : "No customers yet."}
                            </p>
                            <p className="text-sm text-[#9A8574] mt-2">
                                {search
                                    ? "Try another search."
                                    : "Customers will appear after their first order."}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-[#EDE5DB] text-xs uppercase tracking-wider text-[#9A8574]">
                                        <th className="py-4 pr-4">Customer</th>
                                        <th className="py-4 px-4">Phone</th>
                                        <th className="py-4 px-4">Orders</th>
                                        <th className="py-4 px-4">Total Spent</th>
                                        <th className="py-4 pl-4">Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredCustomers.map((customer) => (
                                        <tr key={customer.email} className="border-b border-[#F0EBE5] last:border-0">
                                            <td className="py-4 pr-4">
                                                <p className="text-sm font-medium text-[#302721]">{customer.name}</p>
                                                <p className="text-xs text-[#9A8574]">{customer.email}</p>
                                            </td>
                                            <td className="py-4 px-4 text-sm text-[#81766C]">{customer.phone || "Not provided"}</td>
                                            <td className="py-4 px-4 text-sm text-[#302721]">{customer.totalOrders}</td>
                                            <td className="py-4 px-4 text-sm font-medium text-[#302721]">${customer.totalSpent.toFixed(2)}</td>

                                            <td className="py-4 pl-4">
                                                <button type="button" onClick={() =>
                                                setSelectedCustomer(customer)}
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
                    )}
                </section>

                {/* Customer Details */}
                {selectedCustomer && (
                    <div className="mt-8 bg-white border border-[#EDE5DB] rounded-2xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <p className="text-sm text-[#9A8574]">Customer Profile</p>
                                <h2 className="font-serif text-2xl text-[#302721] mt-1">{selectedCustomer.name}</h2>
                            </div>

                            <button type="button" onClick={() => setSelectedCustomer(null)}
                            className="p-2 rounded-lg text-[#81766C] hover:bg-[#F5EEE7]" aria-label="Close customer details">
                            <X size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-[#302721]">Contact Information</h3>
                                <p className="flex items-center gap-3 text-sm text-[#81766C]">
                                    <Mail size={17} className="text-[#A17A50]" />
                                    {selectedCustomer.email}
                                </p>
                                <p className="flex items-center gap-3 text-sm text-[#81766C]">
                                    <Phone size={17} className="text-[#A17A50]" />
                                    {selectedCustomer.phone || "Not provided"}
                                </p>
                                <p className="flex items-start gap-3 text-sm text-[#81766C]">
                                    <MapPin size={17} className="text-[#A17A50] shrink-0"/>
                                    {selectedCustomer.address || "Not provided"}
                                </p>
                            </div>

                            <div className="bg-[#FAF8F5] rounded-xl p-5 space-y-4">
                                <h3 className="text-sm font-semibold text-[#302721]">Customer Summary</h3>

                                <div className="flex justify-between text-sm">
                                    <span className="text-[#81766C]">Total Orders</span>
                                    <span className="font-medium text-[#302721]">{selectedCustomer.totalOrders}</span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-[#81766C]">Total Spent</span>
                                    <span className="font-medium text-[#302721]">${selectedCustomer.totalSpent.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Customer Order History */}
                        <div className="border-t border-[#EDE5DB] pt-6">
                            <h3 className="font-serif text-xl text-[#302721] mb-5">Order History</h3>

                            <div className="space-y-4">
                                {selectedCustomer.orders.map((order) => (
                                    <div key={order._id} className="border border-[#EDE5DB] rounded-xl p-4">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-3">
                                            <div>
                                                <p className="text-sm font-medium text-[#302721]">
                                                    Order #
                                                    {order._id
                                                        .slice(-6)
                                                        .toUpperCase()}
                                                </p>

                                                <p className="flex items-center gap-2 text-xs text-[#9A8574] mt-1">
                                                    <CalendarDays size={14} />
                                                    {new Date(
                                                        order.createdAt
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>

                                            <div className="text-left sm:text-right">
                                                <p className="font-medium text-sm text-[#302721]">${order.totalAmount.toFixed(2)}</p>
                                                <span className="inline-block mt-1 text-xs px-3 py-1 rounded-full bg-[#F5EEE7] text-[#8E6945]">{order.status}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            {order.items.map((item, index) => (
                                                <div key={`${item.productId}-${index}`} className="flex justify-between text-sm">
                                                    <span className="text-[#81766C]">{item.name} × {item.quantity}</span>
                                                    <span className="text-[#302721]">${(item.price * item.quantity).toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </AdminLayout>
    );
}

export default AdminCustomers;