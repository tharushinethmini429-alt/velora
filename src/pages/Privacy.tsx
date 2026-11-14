
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, LockKeyhole, UserRound, Cookie } from "lucide-react";

function Privacy() {
    return (
    <main className="bg-cream">
        {/* Hero */}
        <section className="grid items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
            <div className="mx-auto max-w-xl">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-rose">Your Trust Matters</p>
                <h1 className="font-serif text-5xl leading-tight text-espresso md:text-6xl">Privacy
                    <span className="block italic text-mauve">Policy.</span>
                </h1>
                
                <p className="mt-6 text-sm leading-8 text-brown">
                    Your privacy matters to us. Learn how Velora
                    collects, uses and protects information when
                    you browse our website or place an order.
                </p>
                
                <Link to="/contact" className="mt-8 inline-flex items-center gap-3 rounded-full bg-espresso px-7 py-4 text-sm text-white transition hover:bg-rose">
                Contact Us
                <ArrowRight size={17} />
                </Link>
            </div>
            
            <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&q=85" alt="Elegant fashion collection" className="h-[380px] w-full object-cover md:h-[500px]"/>
        </section>
        
        {/* Privacy Content */}
        <section className="bg-white px-6 py-20">
            <div className="mx-auto max-w-4xl">
                <div className="mb-12 text-center">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-rose">Your Information</p>
                    <h2 className="font-serif text-4xl text-espresso">How We Respect Your Privacy</h2>
                </div>
                
                <div className="space-y-10">
                    <div className="flex gap-5">
                        <ShieldCheck className="shrink-0 text-rose" size={30} />
                        <div>
                            <h3 className="font-serif text-xl text-espresso">Information We Collect</h3>
                            <p className="mt-3 text-sm leading-7 text-brown">
                                We may collect information you provide when
                                placing an order or contacting us, such as
                                your name, email address, phone number and
                                delivery address.
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex gap-5">
                        <LockKeyhole className="shrink-0 text-rose" size={30} />
                        <div>
                            <h3 className="font-serif text-xl text-espresso">How We Use Your Information</h3>
                            <p className="mt-3 text-sm leading-7 text-brown">
                                Your information may be used to process
                                orders, arrange deliveries, respond to
                                enquiries and improve our shopping experience.
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex gap-5">
                        <UserRound className="shrink-0 text-rose" size={30} />
                        <div>
                            <h3 className="font-serif text-xl text-espresso">Your Information and Security</h3>
                            <p className="mt-3 text-sm leading-7 text-brown">
                                We aim to protect customer information and
                                limit access to people who need it to provide
                                our services.
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex gap-5">
                        <Cookie className="shrink-0 text-rose" size={30} />
                        <div>
                            <h3 className="font-serif text-xl text-espresso">Cookies</h3>
                            <p className="mt-3 text-sm leading-7 text-brown">
                                Cookies and similar technologies may be used
                                to support website functionality and improve
                                the browsing experience.
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="mt-14 border-t border-dusty-rose pt-8">
                    <p className="text-sm leading-7 text-brown">
                        If you have questions about how your information
                        is handled, please contact the Velora team.
                    </p>
                </div>
            </div>
        </section>
        
        {/* Contact */}
        <section className="px-6 py-16 text-center">
            <h2 className="font-serif text-3xl text-espresso">Your Privacy, Our Priority.</h2>
            <p className="mt-4 text-sm text-brown">We're here if you have any privacy-related questions.</p>
            <Link to="/contact" className="mt-7 inline-flex items-center gap-2 rounded-full bg-espresso px-7 py-4 text-sm text-white transition hover:bg-rose">
            Contact Us
            <ArrowRight size={17} />
            </Link>
        </section>
    </main>
);
}

export default Privacy;
