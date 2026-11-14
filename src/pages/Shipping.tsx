
import { Link } from "react-router-dom";
import { ArrowRight, Package, Truck, Clock } from "lucide-react";

function Shipping() {
    return (
        <main className="bg-cream">
            
            {/* Hero */}
            <section className="grid items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
                <div className="mx-auto max-w-xl">
                    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-rose">Velora Delivery</p>
                    <h1 className="font-serif text-5xl leading-tight text-espresso md:text-6xl">Shipping
                        <span className="block italic text-mauve">Information.</span>
                    </h1>
                    
                    <p className="mt-6 text-sm leading-8 text-brown">
                        Every Velora order is prepared with care.
                        Find out more about our delivery process,
                        shipping options and order timelines.
                    </p>

                    <Link to="/shop" className="mt-8 inline-flex items-center gap-3 rounded-full bg-espresso px-7 py-4 text-sm text-white transition hover:bg-rose">
                    Explore Collection
                    <ArrowRight size={17} />
                    </Link>
                </div>
                
                <img src="https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1000&q=85" alt="Beautifully arranged shopping packages"
                className="h-[380px] w-full object-cover md:h-[500px]"/>
            </section>

            {/* Shipping Details */}
            
             <section className="bg-white px-6 py-20">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-12 text-center">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-rose">Delivery Guide</p>
                        <h2 className="font-serif text-4xl text-espresso">Your Order, Our Care</h2>
                    </div>
                    
                    <div className="grid gap-8 md:grid-cols-3">
                        <div className="p-7 text-center">
                            <Package size={32} className="mx-auto text-rose" />
                            <h3 className="mt-5 font-serif text-xl text-espresso">Order Processing</h3>
                            <p className="mt-3 text-sm leading-7 text-brown">
                                Orders are prepared and checked before dispatch.
                                Processing times will be confirmed after purchase.
                            </p>
                        </div>
                        
                        <div className="p-7 text-center">
                            <Truck size={32} className="mx-auto text-rose" />
                            <h3 className="mt-5 font-serif text-xl text-espresso">Delivery Options</h3>
                            <p className="mt-3 text-sm leading-7 text-brown">Delivery availability and charges depend on your delivery location.</p>
                        </div>

                        <div className="p-7 text-center">
                            <Clock size={32} className="mx-auto text-rose" />
                            <h3 className="mt-5 font-serif text-xl text-espresso">Delivery Updates</h3>
                            <p className="mt-3 text-sm leading-7 text-brown">Contact our support team for updates about your order.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact */}
            <section className="px-6 py-16 text-center">
                <h2 className="font-serif text-3xl text-espresso">Need Help With Your Delivery?</h2>
                <p className="mt-4 text-sm text-brown">Our team is here to help with your questions.</p>
                <Link to="/contact" className="mt-7 inline-flex items-center gap-2 rounded-full bg-espresso px-7 py-4 text-sm text-white transition hover:bg-rose">
                Contact Us<ArrowRight size={17} />
                </Link>
            </section>
        </main>
    );
}

export default Shipping;
