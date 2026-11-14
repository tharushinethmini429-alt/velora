import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";
function Categories() {
    const { products, productsLoading } = useShop();
    const categories = [
        {
            name: "Clothing",
            description: "Everyday elegance and timeless outfits.",
            image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=700&q=85",
        },
        {
            name: "Bags",
            description: "Beautiful bags for every occasion.",
            image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=700&q=85",
        },
        {
            name: "Shoes",
            description: "Find your perfect finishing touch.",
            image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=700&q=85",
        },
        {
            name: "Accessories",
            description: "Little details that make a difference.",
            image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=700&q=85",
        },
    ];

    const getProductCount = (categoryName: string) =>
    products.filter((product) => product.category === categoryName).length;

    return (
    <section className="min-h-screen bg-cream px-6 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-rose">Explore Velora</p>
                <h1 className="font-serif text-4xl text-espresso md:text-6xl">Shop by Category</h1>
                <p className="mt-4 text-sm text-brown">Discover pieces that make your everyday style special.</p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {categories.map((category) => (
                    <Link key={category.name} to={`/shop?category=${encodeURIComponent(category.name)}`} className="group block">
                        <div className="overflow-hidden bg-white">
                            <img src={category.image} alt={category.name} className="h-[380px] w-full object-cover transition duration-700 group-hover:scale-105"/>
                        </div>
                        <div className="pt-5 text-center">
                            <h2 className="font-serif text-2xl text-espresso">{category.name}</h2>
                            <p className="mt-2 text-sm text-brown">{category.description}</p>
                            <p className="mt-2 text-xs tracking-wider text-mauve">
                                {productsLoading
                                ? "Loading products..."
                                : `${getProductCount(category.name)} Products`}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    </section>
);
}

export default Categories;