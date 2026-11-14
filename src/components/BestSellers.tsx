import { useShop } from "../context/ShopContext";
import { Heart, ShoppingBag, Star } from "lucide-react";

function BestSellers() {
  const {
    products,
    productsLoading,
    cartItems,
    wishlist,
    addToCart,
    toggleWishlist,
  } = useShop();

const bestSellerProducts = products.filter(
  (product) => product.isFeatured
);
  
  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  
  return (
  <section id="shop" className="bg-cream px-6 py-20 md:py-28">
    <div className="mx-auto max-w-7xl">
      
      {/* Section Heading */}
      <div className="mb-12 flex flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-rose">Our Favorites</p>
          <h2 className="font-serif text-4xl text-espresso md:text-5xl">Best Sellers</h2>
          <p className="mt-3 text-sm text-brown">Discover the pieces everyone loves.</p>
        </div>
        
        <div className="flex items-center gap-2 rounded-full border border-dusty-rose px-5 py-3 text-sm text-espresso">
          <ShoppingBag size={17} />
          Cart: {cartCount}
        </div>
      </div>
      
      {/* Product Grid */}
      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
        {productsLoading ? (
          <p className="col-span-full py-12 text-center text-brown">Loading products...</p>
        ) : bestSellerProducts.map((product) => {
          const isFavorite = wishlist.includes(product.id);
          const discount =
          product.originalPrice && product.originalPrice > product.price
          ? Math.round(
            ((product.originalPrice - product.price) /
            product.originalPrice) *
            100
          )
          : 0;
          
          return (
          <div key={product.id} className="group">
            
            {/* Product Image */}
            <div className="relative overflow-hidden bg-[#F0E8E1]">
              <img src={product.image} alt={product.name} className="h-[340px] w-full object-cover transition duration-700 group-hover:scale-105"/>
              {discount > 0 && (
                <span className="absolute left-4 top-4 bg-rose px-3 py-2 text-[10px] font-semibold tracking-wider text-white">{discount}% OFF</span>
              )}
              
              {/* Wishlist */}
              <button onClick={() => toggleWishlist(product.id)} aria-label={ isFavorite ? "Remove from wishlist" : "Add to wishlist" }
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-espresso transition hover:bg-rose hover:text-white">
                <Heart size={19} fill={isFavorite ? "currentColor" : "none"}/>
              </button>
            </div>
            
            {/* Product Details */}
            <div className="pt-5">
              <p className="text-[10px] font-semibold tracking-[0.2em] text-mauve">{product.category}</p>
              <h3 className="mt-2 font-serif text-xl text-espresso">{product.name}</h3>
              
              {/* Rating */}
              {product.rating !== undefined && (
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex text-[#C99B55]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={14} fill={
                        star <= Math.round(product.rating!)
                        ? "currentColor"
                        : "none"
                      }
                      strokeWidth={1.5}/>
                    ))}
                  </div>
                  <span className="text-xs text-brown">{product.rating.toFixed(1)}</span>
                </div>
              )}
              
              {/* Prices */}
              <div className="mt-4 flex items-center gap-3">
                <span className="text-lg font-semibold text-espresso">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-brown line-through">${product.originalPrice}</span>
                  )}
              </div>
              
              {/* Add to Cart */}
              <button onClick={() => addToCart(product)}
              className="mt-5 flex w-full items-center justify-center gap-2 border border-espresso px-4 py-3 text-sm font-medium text-espresso transition 
              hover:border-rose hover:bg-rose hover:text-white">
                <ShoppingBag size={17} />
                Add to Cart
              </button>
            </div>
          </div>
        );
      })}
    </div>
  </div>
</section>
);
}

export default BestSellers;
