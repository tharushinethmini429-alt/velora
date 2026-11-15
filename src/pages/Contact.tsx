import { useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Link } from "react-router-dom";
import {
    Mail,
    MessageCircle,
    Globe,
    QrCode,
    Send,
} from "lucide-react";

function Contact() {

    const [submitted, setSubmitted] = useState(false);
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");


    const qrRef = useRef<HTMLCanvasElement>(null);
    const storeUrl = "http://172.20.10.5:5173/";
    const handleDownloadQR = () => {
        const canvas = qrRef.current;
        
        if (!canvas) return;
        
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "Velora-Store-QR.png";
        link.click();
    };


    const contactMethods = [
        {
            icon: Mail,
            title: "Email Support",
            detail: "Use our contact form",
            description: "We're ready to hear your questions.",
        },
        {
            icon: MessageCircle,
            title: "WhatsApp",
            detail: "Coming with launch",
            description: "Direct customer support connection.",
        },
        {
            icon: Globe,
            title: "Social Media",
            detail: "Coming with launch",
            description: "Stay connected with the Velora community.",
        },
    ];
    
    return (
    <main className="min-h-screen bg-cream">
        {/* HERO SECTION */}
        <section className="px-6 py-16 md:py-20">
            <div className="mx-auto max-w-7xl text-center">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-rose">Get in Touch</p>
                <h1 className="font-serif text-4xl text-espresso md:text-6xl">We'd Love to Hear From You.</h1>
                <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-brown">Have a question, need assistance or simply want to say hello? We're always happy to connect with you.</p>
                
                <div className="mx-auto mt-10 max-w-6xl overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&q=85" alt="Velora fashion collection" className="h-[220px] w-full object-cover md:h-[320px]"/>
                </div>
            </div>
        </section>
        
        {/* CONTACT INFORMATION */}
        <section className="px-6 pb-16">
            <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
                {contactMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                    <div key={method.title} className="border border-dusty-rose bg-white p-8 text-center transition duration-300 hover:-translate-y-1 hover:shadow-md">
                        <Icon size={29} strokeWidth={1.4} className="mx-auto text-rose"/>
                        <h2 className="mt-5 font-serif text-xl text-espresso">{method.title}</h2>
                        <p className="mt-2 text-sm font-medium text-rose">{method.detail}</p>
                        <p className="mt-3 text-xs leading-6 text-brown">{method.description}</p>
                        </div>
                    );
                })}
            </div>
        </section>
        
        {/* CONTACT FORM AND QR CODE */}
        <section className="bg-white px-6 py-20 md:py-24">
            <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
                
                {/* CONTACT FORM */}
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose">Send Us a Message</p>
                    <h2 className="mt-3 font-serif text-3xl text-espresso md:text-4xl">How Can We Help You?</h2>
                    <p className="mt-4 text-sm leading-7 text-brown">Complete the form below and share what's on your mind.</p>
                    <form
                    onSubmit={async (event) => {
                        event.preventDefault();
                        const form = event.currentTarget;
                        const formData = new FormData(form);
                        const contactData = {
                            name: String(formData.get("name") || ""),
                            email: String(formData.get("email") || ""),
                            subject: String(formData.get("subject") || ""),
                            message: String(formData.get("message") || ""),
                        };
                        setIsSubmitting(true);
                        setErrorMessage("");
                        setSubmitted(false);
                    try {
                        const response = await fetch("http://localhost:5000/api/contact", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(contactData),
                        });
                        const data = await response.json();
                        if (!response.ok) {
                            throw new Error(data.message || "Failed to send your message.");
                        }
                        setSubmitted(true);
                        setMessage("");
                        form.reset();
                    } catch (error) {
                        setErrorMessage(
                            error instanceof Error
                            ? error.message
                            : "Something went wrong. Please try again."
                        );
                    } finally {
                        setIsSubmitting(false);
                    }
                }}
                    onChange={() => setSubmitted(false)} className="mt-8 space-y-5">
                <div>
                    <label htmlFor="contact-name" className="mb-2 block text-xs font-medium text-espresso">Full Name</label>
                    <input id="contact-name" type="text" name="name" required placeholder="Enter your full name"
                    className="w-full border border-dusty-rose bg-cream px-4 py-3 text-sm text-espresso outline-none transition focus:border-rose"/>
                </div>

                <div>
                    <label htmlFor="contact-email" className="mb-2 block text-xs font-medium text-espresso">Email Address</label>
                    <input id="contact-email" type="email" name="email" required placeholder="Enter your email address"
                    className="w-full border border-dusty-rose bg-cream px-4 py-3 text-sm text-espresso outline-none transition focus:border-rose"/>
                </div>
                
                <div>
                    <label htmlFor="contact-subject" className="mb-2 block text-xs font-medium text-espresso">Subject</label>
                    <input id="contact-subject" type="text" name="subject" required placeholder="What is your message about?"
                    className="w-full border border-dusty-rose bg-cream px-4 py-3 text-sm text-espresso outline-none transition focus:border-rose"/>
                </div>
                
                <div>
                    <label htmlFor="contact-message" className="mb-2 block text-xs font-medium text-espresso">Your Message</label>
                    <textarea id="contact-message" name="message" required maxLength={1000} rows={5} placeholder="Write your message here..."
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    className="w-full resize-none border border-dusty-rose bg-cream px-4 py-3 text-sm text-espresso outline-none transition focus:border-rose"/>
                    <p className="mt-2 text-right text-xs text-brown">{message.length}/1000 characters</p>
                </div>
                
                <button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center gap-3 bg-rose px-6 py-4 text-xs font-semibold uppercase tracking-widest
                text-white transition hover:bg-mauve">
                    <Send size={16} />
                    {isSubmitting ? "Sending..." : "Send Message"}
                </button>

                {errorMessage && (
                    <p role="alert" className="text-sm text-red-600">{errorMessage}</p>
                )}
                
                {submitted && (
                    <p role="status" className="border border-dusty-rose bg-cream p-4 text-sm leading-6 text-brown">
                    Thank you for contacting Velora! Your message has been sent successfully. Our team will get back to you soon.</p>
                )}
            </form>
            </div>
            
            {/* QR CODE CARD */}
            <div className="flex flex-col items-center justify-center border border-dusty-rose bg-cream p-8 text-center md:p-12">
                <div className="mb-5 flex h-14 w-14 items-center justify-center bg-rose/10">
                <QrCode size={29} className="text-rose" />
                </div>  
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose">Stay Connected</p>
                <h2 className="mt-4 font-serif text-3xl text-espresso">Let's Connect, Just Scan.</h2>
                <p className="mt-4 max-w-sm text-sm leading-7 text-brown">Scan the Velora QR code to visit our online store and explore our latest collections.</p>
                
                <div className="mt-8 border border-dusty-rose bg-white p-4">
                    <QRCodeCanvas ref={qrRef} value={storeUrl} size={180} level="H"
                    includeMargin bgColor="#FFFFFF" fgColor="#302721"/>
                </div>
                
                <button type="button" onClick={handleDownloadQR}
                className="mt-5 bg-rose px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-mauve">
                    Download QR Code
                </button>


                <p className="mt-5 max-w-xs text-xs leading-6 text-brown">Scan to explore the Velora online store and discover our collections.</p>
            </div>
        </div>
    </section>

    {/* CUSTOMER SUPPORT */}
    <section className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose">Here for You</p>
            <h2 className="mt-3 font-serif text-3xl text-espresso md:text-4xl">We're Happy to Help.</h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
                <div className="border border-dusty-rose bg-white p-7">
                    <h3 className="font-serif text-xl text-espresso">Orders & Delivery</h3>
                    <p className="mt-3 text-sm leading-7 text-brown">Questions about placing orders, delivery or tracking your purchases.</p>
                </div>
                <div className="border border-dusty-rose bg-white p-7">
                    <h3 className="font-serif text-xl text-espresso">Products & Payments</h3>
                    <p className="mt-3 text-sm leading-7 text-brown">Need help with product details, availability or payment information?</p>
                </div>
            </div>
        </div>
    </section>
    
    {/* FINAL CTA */}
    <section className="bg-espresso px-6 py-10 text-center md:py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#D8B5B2]">Discover Velora</p>
        <h2 className="mt-4 font-serif text-3xl text-white md:text-4xl">Your Next Favourite Style Awaits.</h2>
        <Link to="/shop"
        className="mt-5 inline-block bg-rose px-6 py-2 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-white hover:text-espresso">
            Explore Our Collection
        </Link>
    </section>

    <br />
    <br />
</main>
);
}

export default Contact;
