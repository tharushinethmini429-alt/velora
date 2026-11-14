
import { useState } from "react";
import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { ShoppingBag, CheckCircle2 } from "lucide-react";

function Checkout() {
    const { cartItems, clearCart } = useShop();
    const [completedOrderItems, setCompletedOrderItems] = useState<typeof cartItems>([]);

    // Customer Information
    const [customerName, setCustomerName] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    
    // Delivery Information
    const [streetAddress, setStreetAddress] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");

    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [currency, setCurrency] = useState<"LKR" | "GBP">("LKR");
    const [cardName, setCardName] = useState("");
    const [cvc, setCvc] = useState("");

    const [cardNumber, setCardNumber] = useState("");
    const handleCardNumberChange = (value: string) => {
        const digits = value.replace(/\D/g, "").slice(0, 16);
        setCardNumber(digits.replace(/(.{4})/g, "$1 ").trim());
    };

    const [expiryDate, setExpiryDate] = useState("");
    const handleExpiryChange = (value: string) => {
        const digits = value.replace(/\D/g, "").slice(0, 4);
        
        if (digits.length >= 3) {
            setExpiryDate(`${digits.slice(0, 2)}/${digits.slice(2)}`);
        } else {
            setExpiryDate(digits);
        }
    };


    const [showCardBack, setShowCardBack] = useState(false);

const exchangeRates = {
    LKR: 300,
    GBP: 0.79,
};

const exchangeRate = exchangeRates[currency];

const [orderPlaced, setOrderPlaced] = useState(false);

const [isSubmitting, setIsSubmitting] = useState(false);
const [errorMessage, setErrorMessage] = useState("");

const [orderNumber, setOrderNumber] = useState("");

const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
);

const paymentTotal = subtotal * exchangeRate;

const formatPrice = (amount: number) => {
    return new Intl.NumberFormat(
        currency === "LKR" ? "en-LK" : "en-GB",
        {
            style: "currency",
            currency,
        }
    ).format(amount);
};

const validateCardDetails = () => {
    const digits = cardNumber.replace(/\D/g, "");
    
    if (cardName.trim().length < 2) {
        alert("Please enter a valid cardholder name.");
        return false;
    }

    if (digits.length !== 16) {
        alert("Card number must contain exactly 16 digits.");
        return false;
    }

    const [month, year] = expiryDate.split("/");
    const expiryMonth = Number(month);
    const expiryYear = Number(`20${year}`);

    if (
        !month ||
        !year ||
        month.length !== 2 ||
        year.length !== 2 ||
        expiryMonth < 1 ||
        expiryMonth > 12
    ) {
        alert("Please enter a valid expiry date (MM/YY).");
        return false;
    }

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    if (
        expiryYear < currentYear ||
        (expiryYear === currentYear && expiryMonth < currentMonth)
    ) {
        alert("Your card expiry date has passed.");
        return false;
    }

    if (!/^\d{3,4}$/.test(cvc)) {
        alert("CVC must contain 3 or 4 digits.");
        return false;
    }

    return true;
};

    const handlePlaceOrder = async (
    event: React.FormEvent<HTMLFormElement>
) => {
    event.preventDefault();

    setErrorMessage("");
    setIsSubmitting(true);
    
    if (paymentMethod === "card") {
        const isCardValid = validateCardDetails();
        
        if (!isCardValid) {
            setIsSubmitting(false);
            return;
        }
    }
    
    if (cartItems.some((item) => !item.mongoId)) {
        setErrorMessage("Product information is outdated. Please remove the items and add them again.");
        setIsSubmitting(false);
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                customerName,
                email: customerEmail,
                phone: customerPhone,
                address: `${streetAddress}, ${city}, ${postalCode}`,
                items: cartItems.map((item) => ({
                    productId: item.mongoId,
                    quantity: item.quantity,
                })),
                paymentMethod:
                    paymentMethod === "cod"
                        ? "Cash on Delivery"
                        : "Card",
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Order failed");
        }

        setOrderNumber(`VLR-${data._id.slice(-8).toUpperCase()}`);
        setCompletedOrderItems([...cartItems]);
        clearCart();
        setOrderPlaced(true);

    } catch (error) {
        setErrorMessage(
            error instanceof Error
                ? error.message
                : "Something went wrong"
        );
    } finally {
        setIsSubmitting(false);
    }
};

    if (orderPlaced) {
        return (
        <main className="flex min-h-[70vh] items-center justify-center bg-cream px-6 py-16">
            <div className="max-w-xl border border-dusty-rose bg-white p-10 text-center">
                <CheckCircle2 size={55} className="mx-auto text-rose" />
                <h1 className="mt-6 font-serif text-4xl text-espresso">Thank You!</h1>

                <p className="mt-3 text-sm text-brown">
                    Your Order Number:{" "}
                    <span className="font-semibold text-espresso">{orderNumber}</span>
                </p>

                <div className="mt-8 border-y border-dusty-rose py-5 text-left">
                    <h2 className="mb-4 font-serif text-xl text-espresso">Customer & Delivery Details</h2>
                    
                    <div className="space-y-2 text-sm text-brown">
                        <p><span className="font-medium text-espresso">Name:</span> {customerName}</p>
                        <p><span className="font-medium text-espresso">Email:</span> {customerEmail}</p>
                        <p><span className="font-medium text-espresso">Phone:</span> {customerPhone}</p>
                        <p><span className="font-medium text-espresso">Address:</span> {streetAddress}, {city}, {postalCode}</p>
                    </div>
                </div>

                <div className="mt-8 text-left">
                    <h2 className="mb-4 font-serif text-xl text-espresso">Your Order Details</h2>
                    <div className="space-y-4">
                        {completedOrderItems.map((item) => (
                            <div key={item.id}
                            className="flex items-center justify-between border-b border-dusty-rose pb-4">
                            <div>
                                <p className="font-medium text-espresso">{item.name}</p>
                                <p className="text-sm text-brown">Quantity: {item.quantity}</p>
                            </div>
                            <p className="font-medium text-espresso">{currency === "LKR" ? "Rs. " : "£"}
                                {(item.price * item.quantity * (currency === "LKR" ? 300 : 0.79)).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6 flex justify-between border-t border-dusty-rose pt-5">
                    <span className="font-semibold text-espresso">Order Total</span>
                    <span className="font-semibold text-espresso">
                        {currency === "LKR" ? "Rs. " : "£"}
                        {(completedOrderItems.reduce(
                            (total, item) => total + item.price * item.quantity,
                            0
                        ) * (currency === "LKR" ? 300 : 0.79)).toFixed(2)}
                    </span>
                </div>

                <div className="mt-4 flex justify-between">
                    <span className="text-sm text-brown">Payment Method</span>
                    <span className="text-sm font-medium text-espresso">
                        {paymentMethod === "card" ? "Card Payment" : "Cash on Delivery"}
                    </span>
                </div>


                <p className="mt-4 text-sm leading-7 text-brown">
                    Your order has been successfully submitted to Velora.
                    No real payment has been processed.
                </p>
                <Link to="/shop"
                className="mt-8 inline-block bg-rose px-8 py-3 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-mauve">
                    Continue Shopping
                </Link>
            </div>
        </main>
    );
}
if (cartItems.length === 0) {
    return (
    <main className="flex min-h-[70vh] items-center justify-center bg-cream px-6 py-16">
        <div className="text-center">
            <ShoppingBag size={45} className="mx-auto text-rose" />
            <h1 className="mt-6 font-serif text-3xl text-espresso">Your Shopping Bag Is Empty</h1>
            <p className="mt-4 text-sm text-brown">Add some beautiful pieces before proceeding to checkout.</p>
            <Link to="/shop"
            className="mt-8 inline-block bg-rose px-8 py-3 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-mauve">
                Explore the Shop
            </Link>
        </div>
    </main>
    );
}
return (
<main className="min-h-screen bg-cream px-6 py-16 md:py-24">
    <div className="mx-auto max-w-7xl">
        
        {/* Page Heading */}
        <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose">Almost Yours</p>
            <h1 className="mt-3 font-serif text-4xl text-espresso md:text-5xl">Checkout</h1>
            <p className="mt-4 text-sm text-brown">Complete your details and review your Velora order.</p>
        </div>
        <form onSubmit={handlePlaceOrder} className="grid items-start gap-10 lg:grid-cols-5">
            
            {/* Customer Information */}
            <div className="space-y-8 lg:col-span-3">
                <section className="border border-dusty-rose bg-white p-7 md:p-9">
                    <h2 className="font-serif text-2xl text-espresso">Customer Information</h2>
                    <div className="mt-7 grid gap-5 sm:grid-cols-2">
                        
                        <div className="sm:col-span-2">
                            <label className="mb-2 block text-sm text-espresso">Full Name</label>
                            <input type="text" required placeholder="Your full name" autoComplete="name" value={customerName} onChange={(event) => setCustomerName(event.target.value)}
                            className="w-full border border-dusty-rose bg-cream px-4 py-3 text-sm outline-none focus:border-rose"/>
                        </div>
                        
                        <div>
                            <label className="mb-2 block text-sm text-espresso">Email Address</label>
                            <input type="email" required placeholder="you@example.com" autoComplete="email" value={customerEmail} onChange={(event) => setCustomerEmail(event.target.value)}
                            className="w-full border border-dusty-rose bg-cream px-4 py-3 text-sm outline-none focus:border-rose"/>
                        </div>
                        
                        <div>
                            <label className="mb-2 block text-sm text-espresso">Phone Number</label>
                            <input type="tel" required placeholder="Your phone number" autoComplete="tel" value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)}
                            className="w-full border border-dusty-rose bg-cream px-4 py-3 text-sm outline-none focus:border-rose"/>
                        </div>
                    </div>
                </section>
                
                {/* Delivery Information */}
                <section className="border border-dusty-rose bg-white p-7 md:p-9">
                    <h2 className="font-serif text-2xl text-espresso">Delivery Information</h2>
                    <div className="mt-7 space-y-5">
                        <div>
                            <label className="mb-2 block text-sm text-espresso">Street Address</label>
                            <input type="text" required placeholder="House number and street" autoComplete="street-address" value={streetAddress} onChange={(event) => setStreetAddress(event.target.value)}
                            className="w-full border border-dusty-rose bg-cream px-4 py-3 text-sm outline-none focus:border-rose"/>
                        </div>
                        
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm text-espresso">City</label>
                                <input type="text" required placeholder="Your city" autoComplete="address-level2" value={city} onChange={(event) => setCity(event.target.value)}
                                className="w-full border border-dusty-rose bg-cream px-4 py-3 text-sm outline-none focus:border-rose"/>
                            </div>
                            
                            <div>
                                <label className="mb-2 block text-sm text-espresso">Postal Code</label>
                                <input type="text" required placeholder="Postal code" autoComplete="postal-code" value={postalCode}
                                onChange={(event) => setPostalCode(event.target.value)}
                                className="w-full border border-dusty-rose bg-cream px-4 py-3 text-sm outline-none focus:border-rose"/>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* Payment Method */}
                <section className="border border-dusty-rose bg-white p-7 md:p-9">
                    <h2 className="font-serif text-2xl text-espresso">Payment Method</h2>
                    <div className="mb-5">
                        <label className="mb-2 block text-sm font-medium text-espresso">Select Payment Currency</label>
                        <select value={currency} onChange={(event) =>
                        setCurrency(event.target.value as "LKR" | "GBP")
                    }
                    className="w-full rounded-xl border border-dusty-rose bg-white p-3 text-espresso outline-none">
                        <option value="LKR">Sri Lankan Rupees (LKR)</option>
                        <option value="GBP">British Pounds (GBP)</option>
                    </select>
                    <p className="mt-2 text-xs text-brown">Estimated demo exchange rates: 1 USD = 300 LKR or 0.79 GBP. Final rates may differ.</p>
                </div>
                    <div className="mt-6 space-y-4">
                        <label className="flex cursor-pointer items-start gap-3 border border-dusty-rose p-4 transition hover:bg-cream">
                            <input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"}
                            onChange={(event) => setPaymentMethod(event.target.value)}
                            className="mt-1 accent-[#C58F91]"/>
                            
                            <div>
                                <p className="text-sm font-medium text-espresso">Cash on Delivery</p>
                                <p className="mt-1 text-xs text-brown">Demo payment option.</p>
                            </div>
                            
                            </label>
                            <label className="flex cursor-pointer items-start gap-3 border border-dusty-rose p-4 transition hover:bg-cream">
                                <input type="radio" name="payment" value="card" checked={paymentMethod === "card"}
                                onChange={(event) => setPaymentMethod(event.target.value)}
                                className="mt-1 accent-[#C58F91]"/>
                                
                                <div>
                                    <p className="text-sm font-medium text-espresso">Card Payment</p>
                                    <p className="mt-1 text-xs text-brown">Demo only. No card details or real payment required.</p>
                                </div>
                            </label>
                        </div>
                        {paymentMethod === "card" && (
                            <div className="mt-6 space-y-5 rounded-xl border border-dusty-rose bg-cream p-5">
                                <h3 className="font-serif text-xl text-espresso">Card Details</h3>

                                <div className="mb-6 h-52 rounded-2xl bg-gradient-to-br from-espresso to-brown p-6 text-white shadow-xl transition-all duration-500">
                                    {showCardBack ? (
                                        <div className="pt-6">
                                            <div className="h-12 w-full rounded bg-black/70"></div>
                                            <p className="mt-6 text-right text-xs tracking-widest">CARD SECURITY</p>
                                        </div>
                                    ) : (
                                    
                                    <div className="flex h-full flex-col justify-between">
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-semibold tracking-widest">VELORA</span>
                                            <span className="text-xs">DEMO CARD</span>
                                        </div>
                                        <p className="text-lg tracking-widest">{cardNumber || "•••• •••• •••• ••••"}</p>
                                        <div className="flex justify-between text-xs uppercase">
                                            <div>
                                                <p className="opacity-60">Cardholder</p>
                                                <p>{cardName || "YOUR NAME"}</p>
                                            </div>
                                            <div>
                                                <p className="opacity-60">Expires</p>
                                                <p>{expiryDate || "MM/YY"}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <p className="text-xs text-brown">Simulation only. Do not enter real card details.</p>    
                                <div>
                                    <label className="mb-2 block text-sm text-espresso">Cardholder Name</label>
                                    <input type="text" required={paymentMethod === "card"} placeholder="Name shown on card" value={cardName} onChange={(event) => setCardName(event.target.value)}
                                    className="w-full rounded-lg border border-dusty-rose bg-white px-4 py-3 text-sm outline-none focus:border-rose"/>
                                </div>
                                
                                <div>
                                    <label className="mb-2 block text-sm text-espresso">Card Number</label>
                                    <input type="text" inputMode="numeric" maxLength={19} placeholder="0000 0000 0000 0000" autoComplete="off" value={cardNumber} onChange={(event) => handleCardNumberChange(event.target.value)}
                                    className="w-full rounded-lg border border-dusty-rose bg-white px-4 py-3 text-sm outline-none focus:border-rose"/>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="mb-2 block text-sm text-espresso">Expiry Date</label>
                                        <input type="text" placeholder="MM/YY" maxLength={5} autoComplete="off" value={expiryDate} onChange={(event) => handleExpiryChange(event.target.value)}
                                        className="w-full rounded-lg border border-dusty-rose bg-white px-4 py-3 text-sm outline-none focus:border-rose"/>
                                    </div>
                                <div>
                                    <label className="mb-2 block text-sm text-espresso">CVC</label>
                                    <input type="password" inputMode="numeric" maxLength={4} placeholder="123" autoComplete="off" onFocus={() => setShowCardBack(true)} onBlur={() => setShowCardBack(false)}
                                    value={cvc}
                                    onChange={(event) => setCvc(event.target.value.replace(/\D/g, "").slice(0, 4))}
                                    className="w-full rounded-lg border border-dusty-rose bg-white px-4 py-3 text-sm outline-none focus:border-rose"/>
                                </div>
                            </div>
                            <p className="text-sm font-semibold text-espresso">Payment Amount: {formatPrice(paymentTotal)}</p>
                        </div>
                    )}
                </section>
                    
                    
    </div>
    
    {/* Order Summary */}
    <aside className="border border-dusty-rose bg-white p-7 lg:col-span-2 lg:sticky lg:top-28">
        <h2 className="font-serif text-2xl text-espresso">Your Order</h2>
        <div className="mt-7 space-y-6">{cartItems.map((item) => (
            <div key={item.id} className="flex gap-4">
                                <img src={item.image} alt={item.name} className="h-20 w-16 object-cover"/>
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-sm font-medium text-espresso">{item.name}</h3>
                                    <p className="mt-1 text-xs text-brown">Quantity: {item.quantity}</p>
                                    <p className="mt-2 text-sm font-semibold text-espresso">
                                        {formatPrice(item.price * item.quantity * exchangeRate)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-8 space-y-4 border-t border-dusty-rose pt-6">
                        <div className="flex justify-between text-sm">
                            <span className="text-brown">Subtotal</span>
                            <span className="font-medium text-espresso">{formatPrice(paymentTotal)}</span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                            <span className="text-brown">Delivery</span>
                            <span className="text-brown">Not calculated in demo</span>
                        </div>
                        
                        <div className="flex justify-between border-t border-dusty-rose pt-4">
                            <span className="font-semibold text-espresso">Items Subtotal</span>
                            <span className="font-semibold text-espresso">{formatPrice(paymentTotal)}</span>
                        </div>
                    </div>

                    {errorMessage && (
                        <p className="mb-4 text-sm text-red-600">{errorMessage}</p>
                    )}
                    <button type="submit" disabled={isSubmitting} 
                    className="w-full bg-rose px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-mauve disabled:cursor-not-allowed disabled:opacity-60">
                        {isSubmitting ? "Placing Order..." : "Place Order"}
                    </button>
                    
                    <p className="mt-4 text-center text-xs leading-6 text-brown">This is a portfolio demonstration. No real payment will be collected.</p>

                        <Link to="/shop" className="mt-5 block text-center text-xs font-medium text-brown underline transition hover:text-rose">
                            Continue Shopping
                        </Link>
                    </aside>
                </form>
            </div>
        </main>
    );
}

export default Checkout;
