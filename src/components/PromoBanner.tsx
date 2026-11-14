import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

function PromoBanner() {
    return (
        <section className="bg-rose px-6 py-16 md:py-20">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
                <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-cream/20 text-cream">
                        <Sparkles size={28} />
                    </div>

                    <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-cream/80">The Velora Experience</p>
                        <h2 className="font-serif text-3xl text-cream md:text-4xl">Style That Feels Like You.</h2>
                        <p className="mt-3 text-sm text-cream/80">Discover thoughtfully selected pieces that make every moment feel special.</p>
                    </div>
                </div>

                <Link to="/shop" className="flex items-center gap-2 bg-cream px-6 py-3 text-sm font-semibold text-espresso transition hover:bg-white">
                Explore Collection
                <ArrowRight size={17} />
                </Link>
            </div>
        </section>
    );
}

export default PromoBanner;
