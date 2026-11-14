import { useEffect, useState } from "react";

import {
    Heart,
    Users,
    Package,
    Award,
} from "lucide-react";

import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

import AdminLayout from "../layouts/AdminLayout";

type WishlistAnalyticsData = {
    totalWishlistItems: number;
    totalVisitors: number;
    popularProducts: {
        _id: string;
        productName: string;
        wishlistCount: number;
    }[];
};

function AdminWishlistAnalytics() {
    const [analytics, setAnalytics] = useState<WishlistAnalyticsData>({
        totalWishlistItems: 0,
        totalVisitors: 0,
        popularProducts: [],
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const chartColors = [
        "#A17A50",
        "#C49A6C",
        "#D8B99A",
        "#8D7461",
        "#E5D5C5",
        "#B58C83",
    ];

    const chartData = analytics.popularProducts.map((product) => ({
        name: product.productName,
        value: product.wishlistCount,
    }));

    const totalProducts = analytics.popularProducts.length;

    const mostPopularProduct = analytics.popularProducts.reduce(
        (top, product) =>
            product.wishlistCount > (top?.wishlistCount ?? 0)
                ? product
                : top,
        analytics.popularProducts[0]
    );

    const maxWishlistCount = Math.max(
        1,
        ...analytics.popularProducts.map((product) => product.wishlistCount)
    );

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const token = sessionStorage.getItem("velora_admin_token");

                const response = await fetch(
                    "http://localhost:5000/api/wishlist/admin/analytics",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Could not load wishlist analytics.");
                }

                const data: WishlistAnalyticsData = await response.json();
                setAnalytics(data);
            } catch (err) {
                console.error("Wishlist analytics error:", err);
                setError("Failed to load wishlist analytics.");
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    return (
        <AdminLayout>
            <main className="flex-1 p-6 md:p-10">
                <header className="mb-10">
                    <p className="text-sm text-[#9A8574]">Administration / Store Management</p>
                    <h2 className="font-serif text-3xl text-[#302721] mt-2">Wishlist Analytics</h2>
                    <p className="text-sm text-[#81766C] mt-2">Understand what your visitors love most.</p>
                </header>

                {/* Wishlist Statistics */}
                <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    <div className="bg-white rounded-2xl p-6 border border-[#EDE5DB] shadow-sm">
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-[#81766C]">Total Wishlist Items</p>

                            <div className="bg-[#F5EFE7] p-3 rounded-xl">
                                <Heart size={20} className="text-[#A17A50]" />
                            </div>
                        </div>

                        <h3 className="text-3xl font-semibold text-[#302721] mt-5">{loading ? "Loading..." : analytics.totalWishlistItems}</h3>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-[#EDE5DB] shadow-sm">
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-[#81766C]">Wishlist Visitors</p>

                            <div className="bg-[#F5EFE7] p-3 rounded-xl">
                                <Users size={20} className="text-[#A17A50]" />
                            </div>
                        </div>

                        <h3 className="text-3xl font-semibold text-[#302721] mt-5">{loading ? "Loading..." : analytics.totalVisitors}</h3>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-[#EDE5DB] shadow-sm">
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-[#81766C]">Products with Wishlist Activity</p>

                            <div className="bg-[#F5EFE7] p-3 rounded-xl">
                                <Package size={20} className="text-[#A17A50]" />
                            </div>
                        </div>

                        <h3 className="text-3xl font-semibold text-[#302721] mt-5">{loading ? "Loading..." : totalProducts}</h3>
                    </div>
                </section>

                {error && (
                    <p className="text-red-600 text-sm mt-5">{error}</p>
                )}

                {/* Wishlist Product Insights */}
                <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">

                    {/* Donut Chart */}
                    <div className="bg-white rounded-2xl p-7 border border-[#EDE5DB] shadow-sm">

                        <div className="mb-6">
                            <h3 className="font-serif text-xl text-[#302721]">Wishlist Distribution</h3>
                            <p className="text-sm text-[#9A8574] mt-1">Share of wishlist activity by product</p>
                        </div>

                        {loading ? (
                            <p className="text-sm text-[#9A8574]">Loading chart...</p>
                        ) : chartData.length === 0 ? (
                            <p className="text-sm text-[#9A8574]">No wishlist data available yet.</p>
                        ) : (
                            <>
                                <div className="relative h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={72} outerRadius={105} paddingAngle={4} stroke="none">
                                                {chartData.map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]}/>
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>

                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <span className="text-3xl font-semibold text-[#302721]">{analytics.totalWishlistItems}</span>
                                        <span className="text-xs text-[#9A8574]">Total Saves</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                                    {chartData.map((product, index) => (
                                        <div key={product.name} className="flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-full shrink-0" style={{
                                                backgroundColor: chartColors[index % chartColors.length],
                                            }}
                                            />
                                            <span className="text-xs text-[#81766C] truncate">{product.name}</span>
                                            <span className="text-xs font-semibold text-[#302721] ml-auto">{product.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Product Leaderboard */}
                    <div className="bg-white rounded-2xl p-7 border border-[#EDE5DB] shadow-sm">
                        <div className="mb-6">
                            <h3 className="font-serif text-xl text-[#302721]">Top Wishlisted Products</h3>
                            <p className="text-sm text-[#9A8574] mt-1">Products ranked by visitor interest</p>
                        </div>

                        {loading ? (
                            <p className="text-sm text-[#9A8574]">Loading rankings...</p>
                        ) : analytics.popularProducts.length === 0 ? (
                            <p className="text-sm text-[#9A8574]">No products to rank yet.</p>
                        ) : (
                            <>
                                {mostPopularProduct && (
                                    <div className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-[#F8F3ED]">
                                        <Award className="text-[#A17A50]" size={24}/>
                                        <div>
                                            <p className="text-xs text-[#9A8574]">Most Wishlisted Product</p>
                                            <p className="text-sm font-semibold text-[#302721]">{mostPopularProduct.productName}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-5">
                                    {analytics.popularProducts.map((product, index) => (
                                        <div key={product._id} className="flex items-center gap-4">
                                            <div className="w-9 h-9 rounded-xl bg-[#F5EFE7] flex items-center justify-center text-sm font-semibold text-[#A17A50]">{index + 1}</div>
        
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-[#302721] truncate">{product.productName}</p>

                                                <div className="h-2 bg-[#F3EDE6] rounded-full mt-2 overflow-hidden">
                                                    <div className="h-full bg-[#A17A50] rounded-full" style={{
                                                        width: `${(product.wishlistCount / maxWishlistCount) * 100}%`,
                                                    }}
                                                    />
                                                </div>
                                            </div>

                                            <span className="text-sm font-semibold text-[#81766C]">{product.wishlistCount}</span>
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

export default AdminWishlistAnalytics;
