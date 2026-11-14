import { createContext, useContext, useEffect, useState } from "react";
import { fetchProducts } from "../services/productService";

export type Product = {
    id: number;
    mongoId?: string;
    isFeatured?: boolean;
    name: string;
    category: string;
    price: number;
    originalPrice?: number;
    rating?: number;
    reviewCount?: number;
    image: string;
    description?: string;
};

export type CartItem = Product & {
    quantity: number;
};

type ShopContextType = {
    products: Product[];
    productsLoading: boolean;
    cartItems: CartItem[];
    wishlist: number[];
    addToCart: (product: Product) => void;
    decreaseQuantity: (productId: number) => void;
    removeFromCart: (productId: number) => void;
    toggleWishlist: (productId: number) => void;
    clearCart: () => void;
};

const API_URL = "http://localhost:5000/api";

const getGuestId = () => {
    let guestId = localStorage.getItem("velora-guest-id");

    if (!guestId) {
        guestId = crypto.randomUUID();
        localStorage.setItem("velora-guest-id", guestId);
    }

    return guestId;
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: React.ReactNode }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [productsLoading, setProductsLoading] = useState(true);

    useEffect(() => {
    const loadProducts = async () => {
        try {
            const databaseProducts = await fetchProducts();
            setProducts(databaseProducts);
        } catch (error) {
            console.error("Failed to load products:", error);
        } finally {
            setProductsLoading(false);
        }
    };

    loadProducts();
}, []);

        const [cartItems, setCartItems] = useState<CartItem[]>(() => {
            try {
                const savedCart = localStorage.getItem("velora-cart");
                return savedCart ? JSON.parse(savedCart) as CartItem[] : [];
            } catch {
                return [];
            }
        });

        // Load saved wishlist items
        const [wishlist, setWishlist] = useState<number[]>(() => {
            try {
                const savedWishlist = localStorage.getItem("velora-wishlist");
                return savedWishlist ? JSON.parse(savedWishlist) as number[] : [];
            } catch {
                return [];
            }
        });

    // Automatically save cart items
    useEffect(() => {
        localStorage.setItem("velora-cart", JSON.stringify(cartItems));
    }, [cartItems]);
    // Automatically save wishlist items
    useEffect(() => {
        localStorage.setItem("velora-wishlist", JSON.stringify(wishlist));
    }, [wishlist]);

    // Load and sync wishlist with MongoDB
    useEffect(() => {
        if (productsLoading || products.length === 0) return;
        const loadWishlist = async () => {
            try {
                const guestId = getGuestId();

            // Get previously saved browser wishlist
            const savedWishlist = JSON.parse(
                localStorage.getItem("velora-wishlist") || "[]"
            ) as number[];

            // Transfer existing wishlist items to MongoDB
            for (const productId of savedWishlist) {
                const product = products.find(
                    (item) => item.id === productId
                );

                if (product?.mongoId) {
                    await fetch(`${API_URL}/wishlist`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            guestId,
                            productId: product.mongoId,
                        }),
                    });
                }
            }

            // Retrieve wishlist from MongoDB
            const response = await fetch(
                `${API_URL}/wishlist/${guestId}`
            );

            if (!response.ok) {
                throw new Error("Failed to load wishlist");
            }

            const items = await response.json();

            // Convert MongoDB product IDs into frontend product IDs
            const wishlistIds = items
                .map((item: { productId: string }) =>
                    products.find(
                        (product) => product.mongoId === item.productId
                    )?.id
                )
                .filter((id: number | undefined): id is number =>
                    id !== undefined
                );

            setWishlist(wishlistIds);
        } catch (error) {
            console.error("Failed to load wishlist:", error);
        }
    };

    loadWishlist();
}, [products, productsLoading]);

    const addToCart = (product: Product) => {
        setCartItems((previousItems) => {
            const existingItem = previousItems.find(
                (item) => item.id === product.id
            );
            if (existingItem) {
                return previousItems.map((item) =>
                    item.id === product.id
                        ? { ...product, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...previousItems, { ...product, quantity: 1 }];
        });
    };

    const decreaseQuantity = (productId: number) => {
        setCartItems((previousItems) =>
            previousItems
                .map((item) =>
                    item.id === productId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const removeFromCart = (productId: number) => {
        setCartItems((previousItems) =>
            previousItems.filter((item) => item.id !== productId)
        );
    };
    
    const toggleWishlist = async (productId: number) => {
        const product = products.find((item) => item.id === productId);
        
        if (!product || !product.mongoId) {
            console.error("Product or MongoDB ID not found");
            return;
        }
        const guestId = getGuestId();
        const isWishlisted = wishlist.includes(productId);
        try {
            const response = await fetch(
                isWishlisted
                ? `${API_URL}/wishlist/${guestId}/${product.mongoId}`
                : `${API_URL}/wishlist`,
                isWishlisted
                ? { method: "DELETE" }
                : {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        guestId,
                        productId: product.mongoId,
                    }),
                }
            );
            if (!response.ok) {
                throw new Error("Wishlist update failed");
            }
            setWishlist((previousWishlist) =>
                isWishlisted
            ? previousWishlist.filter((id) => id !== productId)
            : [...previousWishlist, productId]
        );
    } catch (error) {
        console.error("Wishlist error:", error);
    }
};


    const clearCart = () => setCartItems([]);

    return (
        <ShopContext.Provider value={{
            products,
            productsLoading,
            cartItems,
            wishlist,
            addToCart,
            decreaseQuantity,
            removeFromCart,
            toggleWishlist,
            clearCart,
        }}>{children}
        </ShopContext.Provider>
    );
}

export function useShop() {
    const context = useContext(ShopContext);

    if (!context) {
        throw new Error("useShop must be used inside ShopProvider");
    }
    return context;
}