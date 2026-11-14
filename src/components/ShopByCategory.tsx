import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

function shopByCategory() {
    const categories = [
        {
            name: "Clothing",
            description: "Everyday elegance",
            image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=700&q=85",
        },
        {
            name: "Bags",
            description: "Carry your style",
            image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=700&q=85",
        },
        {
            name: "Shoes",
            description: "Step with confidence",
            image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=700&q=85",
        },
        {
            name: "Accessories",
            description: "The perfect details",
            image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=700&q=85",
        },
    ];

    return (
        <section id="categories" className="bg-white px-6 py-20 md:py-28">
            <div className="mx-auto max-w-7xl">

                {/*section header*/}
                <div className="mb-12 text-center">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-rose">Find Your Favpurites</p>
                    
                    <h2 className="font-serif text-4xl text-espresso md:text-5xl">Shop by Category</h2>

                    <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-brown">Explore our carefully selected collections and find pieces that reflect your personal style.</p>

                </div>

                {/*category grid*/}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {categories.map((category) => (
                        <Link to={`/categories?category=${encodeURIComponent(category.name)}`} key={category.name} className="group">
                            <div className="relative overflow-hidden bg-[#F5EDE7]">
                                <img src={category.image} alt={category.name} className="h-[340px] w-full object-cover transition duration-700 group-hover:scale-105"/>
                                <div className="absolute inset-0 bg-black/10 transition group-hover:bg-black/20" />
                                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between bg-cream/95 px-5 py-4">
                                <div>
                                    <h3 className="font-serif text-xl text-espresso">{category.name}</h3>
                                    <p className="mt-1 text-xs text-brown">{category.description}</p>
                                </div>

                                <ArrowUpRight size={20} className="text-rose transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
export default shopByCategory;