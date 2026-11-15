import { useEffect, useState } from "react";
import {
    Package,
    Users,
    TrendingUp,
    DollarSign,
    ClipboardList,
} from "lucide-react";
import AdminLayout from "../layouts/AdminLayout";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

type DashboardStats = {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalCustomers: number;
};

type SalesData = {
    month: string;
    revenue: number;
    orders: number;
};

type AdminOrder = {
    status: string;
};

function AdminDashboard() {
    

    const [statsData, setStatsData] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
});

const [statsLoading, setStatsLoading] = useState(true);
const [salesData, setSalesData] = useState<SalesData[]>([]);
const [salesPeriod, setSalesPeriod] = useState("monthly");
const [salesLoading, setSalesLoading] = useState(true);
const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");
const [appliedStartDate, setAppliedStartDate] = useState("");
const [appliedEndDate, setAppliedEndDate] = useState("");

const [orderStatusData, setOrderStatusData] = useState<
{ name: string; value: number }[]
>([]);
const [ordersLoading, setOrdersLoading] = useState(true);

useEffect(() => {
    const fetchStats = async () => {
        try {
            const token = sessionStorage.getItem("velora_admin_token");
            const response = await fetch(
                "http://localhost:5000/api/admin/dashboard-stats",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Could not load dashboard statistics.");
            }
            const data: DashboardStats = await response.json();
            setStatsData(data);
        } catch (error) {
            console.error("Dashboard statistics error:", error);
        } finally {
            setStatsLoading(false);
        }
    };
    fetchStats();
}, []);


useEffect(() => {
    const fetchSales = async () => {
        setSalesLoading(true);

        try {
            const token = sessionStorage.getItem("velora_admin_token");

            const response = await fetch(
                `http://localhost:5000/api/admin/sales-overview?period=${salesPeriod}&startDate=${appliedStartDate}&endDate=${appliedEndDate}`,     
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Could not load sales data.");
            }

            const data: SalesData[] = await response.json();
            setSalesData(data);

        } catch (error) {
            console.error("Sales overview error:", error);
        } finally {
            setSalesLoading(false);
        }
    };

    fetchSales();
}, [salesPeriod, appliedStartDate, appliedEndDate]);


useEffect(() => {
    const fetchOrderStatuses = async () => {
        try {
            const token = sessionStorage.getItem("velora_admin_token");

            const response = await fetch(
                "http://localhost:5000/api/orders",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Could not load order statuses.");
            }

            const orders: AdminOrder[] = await response.json();

            const statuses = ["Pending", "Processing", "Shipped", "Delivered"];

            const result = statuses.map((status) => ({
                name: status,
                value: orders.filter(
                    (order) => order.status.toLowerCase() === status.toLowerCase()
                ).length,
            }));

            setOrderStatusData(result);
        } catch (error) {
            console.error("Order status error:", error);
        } finally {
            setOrdersLoading(false);
        }
    };

    fetchOrderStatuses();
}, []);

    const stats = [
    {
        title: "Total Revenue",
        value: statsLoading
        ? "Loading..."
        : `$${statsData.totalRevenue.toLocaleString()}`,
        icon: DollarSign,
    },
    {
        title: "Total Orders",
        value: statsLoading ? "Loading..." : statsData.totalOrders.toString(),
        icon: ClipboardList,
    },
    {
        title: "Total Products",
        value: statsLoading ? "Loading..." : statsData.totalProducts.toString(),
        icon: Package,
    },
    {
        title: "Total Customers",
        value: statsLoading ? "Loading..." : statsData.totalCustomers.toString(),
        icon: Users,
    },
];
    

    return (
    <AdminLayout>
       
        
        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10">
            <header className="flex justify-between items-center mb-10">
                <div>
                    <p className="text-sm text-[#9A8574]">Administration / Overview</p>
                    <h2 className="font-serif text-3xl text-[#302721] mt-2">Dashboard</h2>
                    <p className="text-sm text-[#81766C] mt-2">Welcome to your Velora store management.</p>
                </div>
                
                <div className="text-right">
                    <p className="text-sm font-medium text-[#302721]">Velora Admin</p>
                    <p className="text-xs text-[#9A8574]">Store Administrator</p>
                </div>
            </header>
            
            {/* Statistics */}
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                    <div key={stat.title} className="bg-white rounded-2xl p-6 border border-[#EDE5DB] shadow-sm">
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-[#81766C]">{stat.title}</p>
                            <div className="bg-[#F5EFE7] p-3 rounded-xl">
                                <Icon size={20} className="text-[#A17A50]" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-semibold text-[#302721] mt-5">{stat.value}</h3>
                    </div>
                );
            })}
            </section>
            
            {/* Overview Section */}
            <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
                <div className="xl:col-span-2 bg-white rounded-2xl p-7 border border-[#EDE5DB] shadow-sm">
                    <div className="flex items-center gap-3">
                        <TrendingUp className="text-[#A17A50]" size={22} />
                        <h3 className="font-serif text-xl text-[#302721]">Sales Overview</h3>
                        
                        <div className="flex flex-wrap items-end gap-3 mt-5">
                            <div>
                                <label className="block text-xs text-[#81766C] mb-2">Start Date</label>
                                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                                className="border border-[#EDE5DB] rounded-lg px-3 py-2 text-sm"/>
                            </div>
                            
                            <div>
                                <label className="block text-xs text-[#81766C] mb-2">End Date</label>
                                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} min={startDate || undefined}
                                className="border border-[#EDE5DB] rounded-lg px-3 py-2 text-sm"/>
                            </div>
                            
                            <button onClick={() => {
                                if (!startDate || !endDate || startDate > endDate) {
                                    alert("Please select a valid date range.");
                                    return;
                                }
                                setAppliedStartDate(startDate);
                                setAppliedEndDate(endDate);
                                setSalesPeriod("custom");
                            }}
                            className="bg-[#A17A50] text-white px-5 py-2 rounded-lg text-sm hover:bg-[#8E6945]">
                                Apply
                            </button>
                        </div>


                        <div className="flex flex-wrap gap-2 mt-5">
                            {["weekly", "monthly", "yearly"].map((period) => (
                                <button key={period} onClick={() => setSalesPeriod(period)}
                                className={`px-4 py-2 rounded-lg text-sm capitalize transition ${
                                    salesPeriod === period
                                    ? "bg-[#A17A50] text-white"
                                    : "bg-[#F5EFE7] text-[#6F5B4B] hover:bg-[#EDE5DB]"
                                }`}>
                                    {period}
                                </button>
                            ))}
                        </div>

                    </div>

                    <div className="mt-8 h-72">
                        {salesLoading ? (
                            <p className="text-sm text-[#9A8574]">Loading sales data...</p>
                        ) : salesData.every((item) => item.revenue === 0) ? (
                        <p className="text-sm text-[#9A8574]">No sales recorded yet.</p>
                    ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={salesData}>
                        <defs>
                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#B18A60" stopOpacity={0.35} />
                                <stop offset="95%" stopColor="#B18A60" stopOpacity={0.02} />
                            </linearGradient>
                        </defs>
                        
                        <CartesianGrid stroke="#F0E9E1" strokeDasharray="4 4" vertical={false}/>
                        <XAxis dataKey="month" tick={{ fill: "#81766C", fontSize: 12 }} axisLine={false} tickLine={false}/>
                        <YAxis tick={{ fill: "#81766C", fontSize: 12 }} axisLine={false} tickLine={false}/>

                        <Tooltip />
                        <Area type="monotone" dataKey="revenue" stroke="#A17A50" strokeWidth={2} fill="url(#revenueGradient)"/>
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>

            </div>
            
            <div className="bg-white rounded-2xl p-7 border border-[#EDE5DB] shadow-sm">
                <h3 className="font-serif text-xl text-[#302721]">Order Status</h3>
                <p className="text-sm text-[#9A8574] mt-1">Overview of your store orders</p>
                
                {ordersLoading ? (
                    <p className="mt-8 text-sm text-[#9A8574]">Loading order data...</p>
                ) : orderStatusData.every((item) => item.value === 0) ? (
                <p className="mt-8 text-sm text-[#9A8574]">No orders available yet.</p>
            ) : (
            <>
            <div className="relative mt-6 h-56">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={orderStatusData} dataKey="value" nameKey="name"
                        innerRadius={65}
                        outerRadius={90}
                        paddingAngle={4}>
                            {orderStatusData.map((item) => (
                                <Cell key={item.name}
                                    fill={
                                        item.name === "Pending" ? "#C6A477" :
                                        item.name === "Processing" ? "#8E735B" :
                                        item.name === "Shipped" ? "#9DABB2" :
                                        "#7D9A83"
                                    }
                                />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{
                            backgroundColor: "#FFFFFF",
                            border: "1px solid #EDE5DB",
                            borderRadius: "12px",
                            padding: "12px",
                        }}
                        labelStyle={{ color: "#6F5B4B", fontWeight: 600 }}
                        formatter={(value) => [
                            value,
                            "Orders",
                        ]}
                    />
                        
                    </PieChart>
                </ResponsiveContainer>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-semibold text-[#302721]">
                        {orderStatusData.reduce(
                            (total, item) => total + item.value, 0
                        )}
                    </span>
                    <span className="text-xs text-[#9A8574]">Total Orders</span>
                </div>
            </div>

            <div className="mt-5 space-y-3">
                {orderStatusData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full" style={{
                                backgroundColor:
                                    item.name === "Pending" ? "#C6A477" :
                                    item.name === "Processing" ? "#8E735B" :
                                    item.name === "Shipped" ? "#9DABB2" :
                                    "#7D9A83"
                            }}/>
                            <span className="text-[#6F5B4B]">{item.name}</span>
                        </div>
                        <span className="font-semibold text-[#302721]">{item.value}</span>
                    </div>
                ))}
            </div>
        </>
    )}
</div>
</section>
</main>
</AdminLayout>
);
}

export default AdminDashboard;
