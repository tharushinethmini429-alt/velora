
import { Link } from "react-router-dom";
import { ArrowRight, RefreshCw, PackageCheck, CreditCard } from "lucide-react";

function Returns() {
    return (
    <main className="bg-cream">
        {/* Hero */}
        <section className="grid items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
            <div className="mx-auto max-w-xl">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-rose">Velora Customer Care</p>
                <h1 className="font-serif text-5xl leading-tight text-espresso md:text-6xl">Returns &<span className="block italic text-mauve">Exchanges.</span></h1>
                <p className="mt-6 text-sm leading-8 text-brown">
                    We want you to love every piece you receive.
                    Explore our returns and exchange information
                    and learn how to get support with your order.
                </p>
                
                <Link to="/contact" className="mt-8 inline-flex items-center gap-3 rounded-full bg-espresso px-7 py-4 text-sm text-white transition hover:bg-rose">
                Get Support
                <ArrowRight size={17} />
                </Link>
            </div>
            
            <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000&q=85" alt="Elegant fashion boutique interior" className="h-[380px] w-full object-cover md:h-[500px]"/>
        </section>
        
        {/* Return Information */}
        <section className="bg-white px-6 py-20">
            <div className="mx-auto max-w-7xl">
                <div className="mb-12 text-center">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-rose">Our Policy</p>
                    <h2 className="font-serif text-4xl text-espresso">Shopping With Confidence</h2>
                </div>
                
                <div className="grid gap-8 md:grid-cols-3">
                    <div className="p-7 text-center">
                        <RefreshCw size={32} className="mx-auto text-rose" />
                        <h3 className="mt-5 font-serif text-xl text-espresso">Exchanges</h3>
                        <p className="mt-3 text-sm leading-7 text-brown">
                            Contact our support team to ask about exchanging
                            an item for another size or available product.
                        </p>
                    </div>
                    
                    <div className="p-7 text-center">
                        <PackageCheck size={32} className="mx-auto text-rose" />
                        <h3 className="mt-5 font-serif text-xl text-espresso">Return Requests</h3>
                        <p className="mt-3 text-sm leading-7 text-brown">
                            Contact us with your order details and the reason
                            for your return request.
                        </p>
                    </div>
                    
                    <div className="p-7 text-center">
                        <CreditCard size={32} className="mx-auto text-rose" />
                        <h3 className="mt-5 font-serif text-xl text-espresso">Refunds</h3>
                            <p className="mt-3 text-sm leading-7 text-brown">
                                Any approved refund will be handled according
                                to the payment method and agreed refund process.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Contact */}
            <section className="px-6 py-16 text-center">
                <h2 className="font-serif text-3xl text-espresso">Need Help With a Return?</h2>
                <p className="mt-4 text-sm text-brown">Our team is happy to assist you.</p>
                <Link to="/contact" className="mt-7 inline-flex items-center gap-2 rounded-full bg-espresso px-7 py-4 text-sm text-white transition hover:bg-rose">
                Contact Us
                <ArrowRight size={17} />
                </Link>
            </section>
        </main>
    );
}

export default Returns;
