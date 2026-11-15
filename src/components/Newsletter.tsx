import {useState } from "react";
import { ArrowRight, Mail, CheckCircle } from "lucide-react";
import { subscribeToNewsletter } from "../services/newsletterService";

function Newsletter() {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) return;

    try {
        await subscribeToNewsletter(email);
        setSubscribed(true);
        setEmail("");
    } catch (error) {
        alert(error instanceof Error ? error.message : "Subscription failed.");
    }
};
    return (
        <section className="bg-[#F0E8E1] px-6 py-20 md:py-24">
            <div className="mx-auto max-w-3xl text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-rose/10 text-rose">
                <Mail size={25} />
                </div>

                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-mauve">Stay Connected</p>
                <h2 className="font-serif text-3xl text-espresso md:text-5xl">A Little Inspiration in Your Inbox</h2>
                <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-brown">Subscribe to discover new collections, exclusive offers, and the latest fashion inspiration from Velora.</p>

                <form onSubmit={handleSubscribe} className="mx-auto mt-9 flex max-w-xl flex-col gap-3 sm:flex-row">
                    <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Enter your email address" 
                    className="min-w-0 flex-1 border border-dusty-rose bg-cream px-5 py-4 text-sm text-espresso outline-none placeholder:text-brown/60 focus:border-rose"/>

                    <button type="submit" className="flex items-center justify-center gap-2 bg-espresso px-7 py-4 text-sm font-semibold text-cream transition hover:bg-rose">
                        Subscribe <ArrowRight size={17} />
                    </button>

                </form>

                    {subscribed && (
                        <p className="mt-5 flex items-center justify-center gap-2 text-sm text-mauve">
                            <CheckCircle size={18} />Thank you for subscribing!
                        </p>
                    )}
                    <p className="mt-5 text-xs text-brown/70">We respect your privacy. Unsubscribe anytime.</p>
                
            </div>
        </section>
    );
}
export default Newsletter;