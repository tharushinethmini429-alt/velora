import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function Hero() {
    return (
    <section id="home" className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-24">
        
        {/* Left Content */}
        <div className="max-w-xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-rose">Timeless Style. Modern Living.</p>
            <h1 className="font-serif text-5xl leading-tight text-espresso md:text-7xl">Your Everyday Style,
                <span className="block italic text-mauve">Upgraded.</span>
            </h1>
            
            <Link to="/shop"
            className="mt-9 inline-flex items-center gap-3 rounded-full bg-espresso px-8 py-4 text-sm font-medium text-white transition hover:bg-rose">
                Shop Now
                <ArrowRight size={17} />
            </Link>
                
                <p className="mt-8 text-xs tracking-widest text-brown">ELEGANCE IN EVERY DETAIL</p>
        </div>
        
        {/* Right Image */}
        <div className="relative">
            <div className="absolute -right-3 -top-3 h-full w-full rounded-t-full border border-dusty-rose md:-right-5 md:-top-5" />
            <img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1000&q=85" alt="Elegant fashion editorial"
            className="relative z-10 h-[420px] w-full rounded-t-full object-cover md:h-[570px]"/>
            
            <div className="absolute -bottom-5 -left-4 z-20 rounded-xl bg-white px-6 py-4 shadow-lg">
                <p className="font-serif text-lg italic text-espresso">Simply Beautiful.</p>
                <p className="mt-1 text-xs text-brown">Discover your style</p>
            </div>
        </div>
    </section>
  );
}

export default Hero;
