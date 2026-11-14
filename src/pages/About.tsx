import { Link } from "react-router-dom";
function About() {
    const collections = [
        {
            name: "Clothing",
            description: "Effortless pieces for your everyday wardrobe.",
            image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=700&q=85",
            category: "Clothing",
        },
        {
            name: "Bags",
            description: "Beautiful details that complete your look.",
            image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=700&q=85",
            category: "Bags",
        },
        {
            name: "Shoes",
            description: "Find the perfect finishing touch.",
            image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=700&q=85",
            category: "Shoes",
        },
        {
            name: "Accessories",
            description: "Small details, unforgettable style.",
            image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=700&q=85",
            category: "Accessories",
        },
    ];
    
    const values = [
        {
            number: "01",
            title: "Timeless Elegance",
            description:
                "We celebrate styles that feel beautiful beyond passing trends.",
        },
        {
            number: "02",
            title: "Everyday Confidence",
            description:
                "Fashion should help you feel comfortable, confident and yourself.",
        },
        {
            number: "03",
            title: "Individual Expression",
            description:
                "Your style is personal. We believe in giving you room to express it.",
        },
    ];

    return (
    <main className="min-h-screen bg-cream">
        
        {/* HERO SECTION */}
        <section className="px-6 py-20 md:py-28">
            <div className="mx-auto max-w-7xl">
                <div className="mb-12 text-center">
                    <img src="/velora-logo.png" alt="Velora Logo" className="mx-auto mb-8 h-32 w-auto object-contain md:h-40"/>
                    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-rose">Welcome to Velora</p>
                    <h1 className="font-serif text-5xl text-espresso md:text-7xl">Style That Feels Like You.</h1>
                    <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-brown md:text-base">Discover a world of timeless fashion, thoughtful details and effortless elegance. Find pieces that make every day feel a little more special.</p>
                </div>
                <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=90" alt="Fashion editorial collection"
                className="h-[240px] w-full object-cover md:h-[380px]"/>
            </div>
        </section>
        
        {/* OUR STORY */}
        <section className="bg-white px-6 py-20 md:py-28">
            <div className="mx-auto grid max-w-7xl items-center gap-14 md:grid-cols-2">
                <div className="rounded-sm border border-dusty-rose bg-cream p-8 md:p-10">
                    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-rose">Get to Know Us</p>
                    <h2 className="font-serif text-4xl leading-tight text-espresso md:text-5xl">A Little More About Our World</h2>
                    <p className="mt-7 text-sm leading-8 text-brown">
                        Velora is a fashion destination inspired by the
                        beauty of simplicity, confidence and personal style.
                        We believe that what you wear is more than just
                        fashion. It is a way to express who you are.
                    </p>
                    <p className="mt-5 text-sm leading-8 text-brown">
                        Our vision is to bring together beautiful clothing,
                        bags, shoes and accessories in one place, making it
                        easier to discover styles that feel right for you.
                    </p>
                    <p className="mt-5 text-sm leading-8 text-brown">
                        At Velora, we believe that true elegance is not
                        about following every trend. It is about finding
                        your own style and wearing it with confidence.
                    </p>
                </div>
                
                <div className="overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=90" alt="Elegant fashion collection" className="h-[300px] w-full object-cover transition duration-700 hover:scale-105 md:h-[360px]"/>
                </div>

            </div>
        </section>
        
        {/* OUR PHILOSOPHY */}
        <section className="px-6 py-20 md:py-28">
            <div className="mx-auto max-w-7xl text-center">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-rose">What We Believe</p>
                <h2 className="font-serif text-4xl text-espresso md:text-5xl">The Velora Philosophy</h2>
                <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-brown">Everything we stand for begins with three simple ideas.</p>
                <div className="mt-14 grid gap-8 md:grid-cols-3">
                    {values.map((value) => (
                        <div key={value.number} className="border border-dusty-rose bg-white px-8 py-12 transition duration-300 hover:-translate-y-2 hover:shadow-lg">
                            <p className="font-serif text-3xl text-rose">{value.number}</p>
                            <h3 className="mt-6 font-serif text-2xl text-espresso">{value.title}</h3>
                            <p className="mt-4 text-sm leading-7 text-brown">{value.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
        
        {/* OUR COLLECTIONS */}
        <section className="bg-white px-6 py-20 md:py-28">
            <div className="mx-auto max-w-7xl">
                <div className="text-center">
                    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-rose">Explore Velora</p>
                    <h2 className="font-serif text-4xl text-espresso md:text-5xl">Discover Our Collections</h2>
                    <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-brown">
                        From everyday essentials to beautiful finishing
                        touches, explore a collection made to complement
                        your personal style.
                    </p>
                </div>
                
                <div className="mt-14 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
                    {collections.map((item) => (
                        <Link key={item.name} to={`/shop?category=${item.category}`} className="group overflow-hidden border border-dusty-rose bg-cream p-4 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                                <div className="overflow-hidden bg-[#F0E8E1]">
                                    <img src={item.image} alt={item.name} className="aspect-[3/4] w-full object-cover transition duration-700 group-hover:scale-105"/>
                                </div>
                                <h3 className="mt-5 font-serif text-2xl text-espresso transition group-hover:text-rose">{item.name}</h3>
                                <p className="mt-2 text-sm leading-6 text-brown">{item.description}</p>
                                <span className="mt-4 inline-block border-b border-rose pb-1 text-xs font-semibold uppercase tracking-widest text-rose">Explore Collection</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
        {/* OUR PROMISE */}
        <section className="px-6 py-20 md:py-28">
            <div className="mx-auto max-w-5xl border border-dusty-rose bg-white px-8 py-14 text-center shadow-sm md:px-16 md:py-20">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-rose">The Velora Promise</p>
                <h2 className="font-serif text-4xl text-espresso md:text-5xl">Fashion Should Feel Personal.</h2>
                <p className="mx-auto mt-7 max-w-2xl text-sm leading-8 text-brown">
                    We want every visit to Velora to feel simple,
                    inspiring and enjoyable. From discovering your
                    favourite pieces to finding the details that make
                    your style unique, we want to make your shopping
                    experience feel special.
                </p>
            </div>
        </section>
        
        {/* FINAL CALL TO ACTION */}
        <section className="bg-espresso px-6 py-12 text-center md:py-16">
            <div className="mx-auto max-w-3xl">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#D8B5B2]">Your Style Journey</p>
                <h2 className="font-serif text-4xl text-white md:text-5xl">Find Your Kind of Beautiful.</h2>
                <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-[#E8DCD4]">Explore the Velora collection and discover pieces that feel like you.</p>
                <Link to="/shop" className="mt-6 inline-block bg-rose px-8 py-3 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-white hover:text-espresso">Explore the Shop</Link>
            </div>
        </section>

        <br />
        <br />

    </main>
);
}

export default About;
