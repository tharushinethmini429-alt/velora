
import { useState } from "react";
import { createPortal } from "react-dom";
import { useShop } from "../context/ShopContext";
import { products } from "../data/products";
import { Link, useNavigate } from "react-router-dom";
import {
    Search,
    Heart,
    ShoppingBag,
    Menu,
    X,
    Trash2,
    Plus,
    Minus,
} from "lucide-react";
function Navbar() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const {
        cartItems,
        wishlist,
        decreaseQuantity,
        addToCart,
        removeFromCart,
        toggleWishlist,
    } = useShop();

    const cartCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const cartSubtotal = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [activeDrawer, setActiveDrawer] = useState<"cart" | "wishlist" | null>(null);

    const links = [
    { name: "Home", href: "/", isPage: true },
    { name: "Shop", href: "/shop", isPage: true },
    { name: "Categories", href: "/categories", isPage: true },
    { name: "About", href: "/about", isPage: true },
    { name: "Contact", href: "/contact", isPage: true },
    ]
    return (
    <header className="sticky top-0 z-50 border-b border-[#EDE3D9] bg-cream/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
            
            {/* Logo */}
            <Link to="/" className="font-serif text-3xl font-bold tracking-wide">
            Velora<span className="text-rose">.</span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-9 md:flex">
                {links.map((link) => {
                    return link.isPage ? (
                    <Link key={link.name} to={link.href} className="text-sm font-medium text-brown transition hover:text-rose">{link.name}</Link>
                ) : (
                <a key={link.name} href={link.href} className="text-sm font-medium text-brown transition hover:text-rose">{link.name}</a>
            );
        })}
        </nav>
            
            {/* Action Icons */}
            <div className="flex items-center gap-5">
                <button aria-label="Search" className="hidden sm:block" onClick={() => {
                    setSearchOpen(!searchOpen);
                    setActiveDrawer(null);
                }}>
                    <Search size={20} strokeWidth={1.6} />
                </button>
                
                <button aria-label="Wishlist" className="relative" onClick={() => setActiveDrawer("wishlist")}>
                    <Heart size={20} strokeWidth={1.6} />
                    {wishlist.length > 0 && (
                        <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-rose text-[10px] text-white">{wishlist.length}</span>
                    )}
                </button>

                <button aria-label="Shopping cart" className="relative" onClick={() => setActiveDrawer("cart")}>
                    <ShoppingBag size={21} strokeWidth={1.6} />
                    {cartCount > 0 && (
                        <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-rose text-[10px] text-white">{cartCount}</span>
                    )}
                </button>


                {/* Mobile Menu */}
                <button aria-label="Toggle menu" className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <X size={23} /> : <Menu size={23} />}
                </button>
            </div>
        </div>
        
        {/* Search Bar */}
        {searchOpen && (
            <div className="border-t border-[#EDE3D9] bg-cream px-6 py-5">
                <div className="mx-auto flex max-w-3xl items-center gap-3 border-b border-brown/30 pb-3">
                <Search size={20} className="text-brown" />
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={(e) => {
                    if (e.key === "Enter" && searchTerm.trim()) {
                        navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
                        setSearchOpen(false);
                        setSearchTerm("");
                    }
                }}
                placeholder="Search for products..."
                className="w-full bg-transparent text-sm text-espresso outline-none placeholder:text-brown/60"/>
                <button aria-label="Close search" onClick={() => setSearchOpen(false)}>
                    <X size={20} />
                </button>
                </div>
            </div>
        )}
        
        {/* Shopping Drawer */}
        {activeDrawer && createPortal(
            <div className="fixed inset-0 z-[60]">
                <button  aria-label="Close drawer" className="absolute inset-0 h-full w-full bg-black/40" onClick={() => setActiveDrawer(null)}/>
                <div className="drawer-panel fixed right-0 top-0 flex h-dvh w-full max-w-md flex-col bg-cream shadow-xl">
                    <div className="flex items-center justify-between border-b border-[#EDE3D9] px-6 py-5">

                    <div>
                        <h2 className="font-serif text-2xl text-espresso">{activeDrawer === "cart" ? "Your Shopping Bag" : "My Wishlist"}</h2>
                        {activeDrawer === "wishlist" && (
                            <p className="mt-1 text-xs tracking-wide text-brown">{wishlist.length} SAVED ITEMS</p>
                        )}
                        {activeDrawer === "cart" && (
                            <p className="mt-1 text-xs tracking-wide text-brown">{cartCount} ITEMS IN YOUR BAG</p>
                        )}
                    </div>
                        

                        <button aria-label="Close" onClick={() => setActiveDrawer(null)}><X size={23} /></button>
                    </div>
                    <div className="drawer-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain p-6">
                        {activeDrawer === "cart" ? (
                            cartItems.length === 0 ? (
                            <p className="text-center text-brown">Your shopping bag is empty.</p>
                        ) : (
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div key={item.id} className="border-b border-[#EDE3D9] pb-6 last:border-0">
                                    <img src={item.image} alt={item.name} className="h-24 w-20 rounded-sm object-cover"/>
                                    <div className="mt-4 flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <h3 className="font-serif text-xl text-espresso">{item.name}</h3>
                                            <p className="mt-2 text-sm text-brown">${item.price.toFixed(2)} each</p>
                                            <div className="mt-4 flex items-center gap-4">
                                                <button onClick={() => decreaseQuantity(item.id)} className="border border-dusty-rose px-3 py-1">
                                                    <Minus size={15} />
                                                </button>
                                                <span className="text-sm">{item.quantity}</span>
                                                <button onClick={() => addToCart(item)} className="border border-dusty-rose px-3 py-1">
                                                    <Plus size={15} />
                                                </button>
                                            </div>
                                        </div>
                                    <button className="text-brown transition hover:text-rose" aria-label="Remove item" onClick={() => removeFromCart(item.id)}>
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}

    <div className="mt-8 border-t border-[#EDE3D9] pt-6">
        <div className="flex justify-between text-sm">
            <span className="text-brown">Subtotal</span>
            <span className="font-semibold text-espresso">
                ${cartSubtotal.toFixed(2)}
            </span>
        </div>

        <Link to="/checkout" onClick={() => setActiveDrawer(null)}
        className="mt-5 block w-full bg-rose py-3 text-center text-sm font-medium uppercase tracking-widest text-white transition hover:bg-mauve">
            Proceed to Checkout
        </Link>
    </div>
</div>
                    )
                ) : wishlist.length === 0 ? (

                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <Heart size={38} strokeWidth={1.2} className="mb-5 text-rose" />
                        <h3 className="font-serif text-xl text-espresso">Your wishlist is waiting</h3>
                        <p className="mt-2 max-w-xs text-sm leading-6 text-brown">Save the pieces you love and keep your favourite styles close.</p>
                        <Link to="/shop" onClick={() => setActiveDrawer(null)}
                        className="mt-6 border-b border-rose pb-1 text-xs font-medium uppercase tracking-widest text-rose transition hover:text-mauve">
                            Explore Collection
                        </Link>
                    </div>
                

                ) : (
                <div className="space-y-4">
                    {products
                    .filter((product) => wishlist.includes(product.id))
                    .map((product) => (
                    <div key={product.id} className="flex items-start gap-5 border-b border-[#EDE3D9] pb-6 last:border-0">
                        <img src={product.image} alt={product.name} className="h-24 w-20 rounded-sm object-cover" />
                        <div className="flex-1">
                            
                            <p className="text-[10px] uppercase tracking-[0.2em] text-rose">{product.category}</p>
                            <h3 className="mt-2 font-serif text-lg text-espresso">{product.name}</h3>
                            <p className="mt-2 text-sm font-medium text-brown">${product.price.toFixed(2)}</p>

                            <div className="mt-3 flex items-center gap-3">
                                
                                <button className="border border-rose bg-rose px-4 py-2 text-xs font-medium uppercase tracking-wider text-white transition hover:bg-mauve hover:border-mauve" onClick={() => {
                                    addToCart(product);
                                    setActiveDrawer("cart");
                                }}>Add to Bag</button>


                                <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[#EDE3D9] text-brown transition hover:border-rose hover:bg-[#F5E8E7] hover:text-rose" aria-label="Remove from wishlist"
                                 title="Remove from wishlist" onClick={() => toggleWishlist(product.id)}>
                                    <Trash2 size={16} strokeWidth={1.5} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
</div>
</div>
</div>,
document.body
)}     
        {/* Mobile Navigation */}
        {menuOpen && (
            <nav className="flex flex-col gap-5 border-t border-[#EDE3D9] bg-cream px-6 py-6 md:hidden">
                {links.map((link) => ( link.isPage ? (
                    <Link key={link.name} to={link.href} onClick={() => setMenuOpen(false)} className="text-sm font-medium text-brown hover:text-rose">
                        {link.name}
                    </Link>
                ) : (
                <a key={link.name} href={link.href} onClick={() => setMenuOpen(false)} className="text-sm font-medium text-brown hover:text-rose">{link.name}</a>
                )
            ))}
        </nav>
    )}
</header>
);
}

export default Navbar;
