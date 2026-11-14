import { useEffect, useState } from "react";
import { useShop } from "../context/ShopContext";
import type { Product } from "../context/ShopContext";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, Heart, Star } from "lucide-react";

function Shop() {
    const [searchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get("search") || "");

    useEffect(() => {
        setSearch(searchParams.get("search") || "");
        setSelectedCategory(searchParams.get("category") || "All Products");
    }, [searchParams]);

    const {
    products,
    productsLoading,
    wishlist,
    addToCart,
    toggleWishlist,
} = useShop();
    
    const [selectedCategory, setSelectedCategory] = useState(
        searchParams.get("category") || "All Products"
    );
    const [showFilters, setShowFilters] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());
        
        const matchesCategory =
        selectedCategory === "All Products" ||
        product.category === selectedCategory;
        
        return matchesSearch && matchesCategory;
    });
    
    const [sortOption, setSortOption] = useState("default");
    
    const categories = [
        "All Products",
        "Clothing",
        "Bags",
        "Shoes",
        "Accessories",
    ];
    
  
const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "name") {
        return a.name.localeCompare(b.name);
    }
    if (sortOption === "price-low") {
        return a.price - b.price;
    }
    if (sortOption === "price-high") {
        return b.price - a.price;
    }
    return 0;
});
    

 return (
    <section className="min-h-screen bg-cream px-6 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-rose">Discover Your Style</p>
                <h1 className="font-serif text-4xl text-espresso md:text-6xl">The Shop</h1>
                <p className="mt-4 text-sm text-brown">Explore timeless pieces made for your everyday style.</p>

                <div className="mb-6 mt-10 flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="flex flex-1 items-center gap-3 rounded-xl border border-[#E8DCD2] bg-white px-5 py-4 shadow-[0_4px_12px_rgba(74,48,41,0.06)] transition-all duration-300 focus-within:-translate-y-0.5 focus-within:border-rose focus-within:shadow-[0_8px_20px_rgba(74,48,41,0.12)]">
                        <Search size={19} className="text-mauve" />
                        <input type="text" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products..."
                        className="w-full bg-transparent text-sm text-espresso outline-none placeholder:text-brown/50"/>
                    </div>
                    
                    <button onClick={() => setShowFilters(!showFilters)} className="flex items-center justify-center gap-2 rounded-xl border border-[#D9C5B8] bg-[#F8F1EB] px-6 py-4 text-sm font-semibold text-espresso shadow-[0_4px_0_#D9C5B8,0_6px_12px_rgba(74,48,41,0.08)] transition-all duration-200 hover:-translate-y-1 hover:bg-rose hover:text-white hover:shadow-[0_5px_0_#A85F69,0_10px_18px_rgba(74,48,41,0.12)] active:translate-y-1 active:shadow-none">
                        <SlidersHorizontal size={18} />Filters
                    </button>
                    
                    <select value={sortOption} onChange={(event) => setSortOption(event.target.value)}
                    className="cursor-pointer rounded-xl border border-[#E8DCD2] bg-white px-5 py-4 text-sm font-semibold text-espresso shadow-[0_4px_0_#E8DCD2,0_6px_12px_rgba(74,48,41,0.06)] outline-none transition-all duration-200 hover:-translate-y-1 hover:border-rose hover:shadow-[0_5px_0_#D9A0A6,0_10px_18px_rgba(74,48,41,0.10)] focus:border-rose active:translate-y-0">
                        <option value="default" className="bg-white text-brown">Sort By</option>
                        <option value="name" className="bg-white text-espresso">Name: A–Z</option>
                        <option value="price-low" className="bg-white text-espresso">Price: Low to High</option>
                        <option value="price-high" className="bg-white text-espresso">Price: High to Low</option>
                    </select>
                </div>

                

                {showFilters && (
                    <div className="mb-8 flex flex-wrap justify-center gap-3">
                        {categories.map((category) => (
                            <button key={category} onClick={() => setSelectedCategory(category)} 
                            className={`rounded-full border px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                                selectedCategory === category
                                ? "border-rose bg-rose text-white shadow-[0_4px_0_#A85F69,0_7px_14px_rgba(74,48,41,0.12)] -translate-y-0.5"
                                : "border-[#E8DCD2] bg-white text-brown shadow-[0_3px_0_#E8DCD2] hover:-translate-y-1 hover:border-rose hover:text-rose hover:shadow-[0_5px_0_#D9A0A6]"
                            }`}
                            >
                            {category}
                        </button>
                    ))}
                </div>
            )}

                <div className="mb-6 flex items-center justify-between">
                    <p className="text-sm text-brown">Showing {filteredProducts.length} products</p>
                </div>

                
            </div>

            {selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="relative grid w-full max-w-4xl grid-cols-1 gap-8 bg-white p-6 md:grid-cols-2">
                        <img src={selectedProduct.image} alt={selectedProduct.name} className="aspect-[3/4] w-full object-cover"/>
                        <div className="flex flex-col justify-center">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mauve">{selectedProduct.category}</p>
                            <h2 className="mt-3 font-serif text-3xl text-espresso">{selectedProduct.name}</h2>
                            <p className="mt-4 text-sm leading-7 text-brown">{selectedProduct.description}</p>

                            {selectedProduct.rating !== undefined && (
                                <div className="mt-4 flex items-center gap-2 text-sm">
                                    <Star size={16} className="fill-[#D6A85C] text-[#D6A85C]" />
                                    <span className="font-semibold text-espresso">{selectedProduct.rating.toFixed(1)}</span>
                                    <span className="text-brown">({selectedProduct.reviewCount ?? 0} reviews)</span>
                                </div>
                            )}

<div className="mt-5 flex items-center gap-3">
    <p className="text-2xl font-bold text-espresso">${selectedProduct.price.toFixed(2)}</p>
    {selectedProduct.originalPrice &&
    selectedProduct.originalPrice > selectedProduct.price && (
    <>
    <p className="text-sm text-brown/60 line-through">${selectedProduct.originalPrice.toFixed(2)}</p>
    <span className="rounded-full bg-rose px-3 py-1 text-xs font-bold text-white">
        {Math.round(
            ((selectedProduct.originalPrice - selectedProduct.price) / 
            selectedProduct.originalPrice) * 100
        )}% OFF
    </span>
    </>
    )}
</div>
                            

                            <button onClick={() => {
                                addToCart(selectedProduct);
                                setSelectedProduct(null);
                            }}
                            className="mt-6 w-full rounded-xl border border-[#4B3029] bg-espresso px-5 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-[0_5px_0_#2D1B17,0_8px_15px_rgba(74,48,41,0.12)] transition-all duration-200 hover:-translate-y-1 hover:border-rose hover:bg-rose hover:shadow-[0_6px_0_#A85F69,0_12px_20px_rgba(74,48,41,0.16)] active:translate-y-1 active:shadow-none">
                                Add to Cart
                            </button>
                            <button onClick={() => setSelectedProduct(null)} className="mt-3 text-sm text-brown underline">Close</button>
                        </div>
                    </div>
                </div>
            )}

            {productsLoading ? (
                <p className="py-16 text-center text-brown">Loading products...</p>
            ) : (


            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                
                
                {sortedProducts.map((product) => (
                    <div key={product.id}
                    className="group rounded-2xl bg-white p-3 shadow-[0_4px_18px_rgba(74,48,41,0.05)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_14px_30px_rgba(74,48,41,0.12)]">
                        <div className="relative overflow-hidden rounded-xl bg-[#F0E8E1]">
                            {product.originalPrice && product.originalPrice > product.price && (
                                <span className="absolute left-3 top-3 z-10 rounded-full bg-rose px-3 py-1 text-xs font-bold text-white shadow-md">
                                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                                </span>
                            )}
                            <img src={product.image} alt={product.name} className="aspect-[3/4] w-full object-cover transition duration-700 ease-out group-hover:scale-105"/>
                            <button onClick={() => toggleWishlist(product.id)}
                            aria-label={
                                wishlist.includes(product.id)
                                ? "Remove from wishlist"
                                : "Add to wishlist"
                            }
                            className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/95 text-rose shadow-[0_4px_12px_rgba(74,48,41,0.15)] backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-rose hover:text-white active:scale-95">
                                <Heart size={19} fill={wishlist.includes(product.id) ? "currentColor" : "none"}/>
                            </button>
                        </div>
                        
                        <div className="pt-5">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-mauve">{product.category}</p>

                            {product.rating !== undefined && (
                                <div className="mt-2 flex items-center gap-1.5 text-sm">
                                    <Star size={15} className="fill-[#D6A85C] text-[#D6A85C]" />
                                    <span className="font-semibold text-espresso">{product.rating.toFixed(1)}</span>
                                    <span className="text-brown">({product.reviewCount ?? 0} reviews)</span>
                                </div>
                            )}

                            <h3 className="mt-3 min-h-[56px] font-serif text-lg leading-7 text-espresso transition-colors duration-300 group-hover:text-rose md:text-xl">{product.name}</h3>
                            <div className="mt-3 flex flex-wrap items-center gap-3">
                                <p className="text-xl font-bold tracking-wide text-espresso">${product.price.toFixed(2)}</p>
                                {product.originalPrice && product.originalPrice > product.price && (
                                    <p className="text-sm text-brown/60 line-through">${product.originalPrice.toFixed(2)}</p>
                                )}
                            </div>
                            <button onClick={() => addToCart(product)}
                            className="mt-5 w-full rounded-xl border border-[#4B3029] bg-espresso px-4 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-[0_5px_0_#2D1B17,0_8px_15px_rgba(74,48,41,0.12)] transition-all duration-200 hover:-translate-y-1 hover:bg-rose hover:border-rose hover:shadow-[0_6px_0_#A85F69,0_12px_20px_rgba(74,48,41,0.16)] active:translate-y-1 active:shadow-none">
                            Add to Cart</button>
                            
                            <button onClick={() => setSelectedProduct(product)} className="mt-4 inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-brown transition-all duration-300 hover:translate-x-1 hover:text-rose">
                                View Details
                                <span aria-hidden="true">→</span>
                            </button>
                        </div>
                        
                    </div>
                ))}
            </div>
            )}
            
            {filteredProducts.length === 0 && (
                <p className="py-16 text-center text-brown">No products found. Try another search.</p>
            )}
        </div>
    </section>
);
}
export default Shop;