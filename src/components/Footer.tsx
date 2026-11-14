import { Link } from "react-router-dom";
import {
    Camera,
    Users,
    MessageCircle,
    Mail,
    MapPin,
    Phone,
    ArrowUpRight,
} from "lucide-react";

function Footer() {
    return (
    <footer className="bg-espresso px-6 pb-8 pt-16 text-cream">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
            <div>
                <h2 className="font-serif text-3xl tracking-wide">VELORA.</h2>
                <p className="mt-5 max-w-xs text-sm leading-7 text-cream/65">Discover timeless fashion and everyday essentials. Express your style with confidence, 
                elegance, and comfort.</p>
                
                <div className="mt-6 flex gap-4">
                    <a href="https://www.instagram.com/" aria-label="Instagram" className="transition hover:text-dusty-rose"><Camera size={19} /></a>
                    <a href="https://www.facebook.com/" aria-label="Facebook" className="transition hover:text-dusty-rose"><Users size={19} /></a>
                    <a href="https://twitter.com/" aria-label="Twitter" className="transition hover:text-dusty-rose"><MessageCircle size={19} /></a>
                </div>
            </div>
            
            <div>
                <h3 className="mb-5 text-sm font-semibold tracking-widest">EXPLORE</h3>
                <ul className="space-y-4 text-sm text-cream/65">
                <li><Link to="/contact" className="transition hover:text-cream">Contact Us</Link></li>
                <li><Link to="/" className="transition hover:text-cream">Home</Link></li>
                <li><Link to="/shop" className="transition hover:text-cream">Shop</Link></li>
                <li><Link to="/categories" className="transition hover:text-cream">Categories</Link></li>
                </ul>
            </div>
            
            <div>
                <h3 className="mb-5 text-sm font-semibold tracking-widest">CUSTOMER CARE</h3>
                <ul className="space-y-4 text-sm text-cream/65">
                <li><Link to="/contact" className="transition hover:text-cream">Contact Us</Link></li>
                <li><Link to="/shipping" className="transition hover:text-cream">Shipping Information</Link></li>
                <li><Link to="/returns" className="transition hover:text-cream">Returns & Exchanges</Link></li>
                <li><Link to="/privacy" className="transition hover:text-cream">Privacy Policy</Link></li>
                </ul>
            </div>
            <div>
                <h3 className="mb-5 text-sm font-semibold tracking-widest">GET IN TOUCH</h3>
                <div className="space-y-4 text-sm text-cream/65">
                <p className="flex items-center gap-3"><Mail size={17} /> hello@velora.com</p>
                <p className="flex items-center gap-3"><Phone size={17} /> +94 XX XXX XXXX</p>
                <p className="flex items-center gap-3"><MapPin size={17} /> Sri Lanka</p>
            </div>
        </div>
    </div>
    
    <div className="mx-auto mt-14 max-w-7xl border-t border-cream/15 pt-7">
    <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row">
        <p className="text-xs text-cream/50">&copy; {new Date().getFullYear()} Velora. All rights reserved.</p>
        <Link to="/" className="flex items-center gap-2 text-xs text-cream/65 transition hover:text-cream">Back to top <ArrowUpRight size={15} /></Link>
    </div>
</div>
</footer>
);
}

export default Footer;
