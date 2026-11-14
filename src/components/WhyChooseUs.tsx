import {
    Truck,
    ShieldCheck,
    Headset,
    RefreshCw,
} from "lucide-react";

function WhyChooseUs() {
    const features = [
        {
            icon: Truck,
            title: "Free Shipping",
            description: "Enjoy free delivery on qualifying orders.",
        },
        {
            icon: ShieldCheck,
            title: "Secure Payments",
            description: "Your transactions are protected and secure.",
        },
        {
            icon: Headset,
            title: "24/7 Support",
            description: "We're always here whenever you need us.",
        },
        {
            icon: RefreshCw,
            title: "Easy Returns",
            description: "Simple and convenient return experience.",
        },
    ];
    
    return (
    <section className="border-y border-[#EDE3D9] bg-[#FAF6F0] px-6 py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
                const Icon = feature.icon;
                return (
                <div key={feature.title} className="flex flex-col items-center text-center">
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#F0E2DF] text-mauve">
                        <Icon size={25} strokeWidth={1.5} />
                    </div>
                    
                    <h3 className="font-serif text-xl text-espresso">{feature.title}</h3>
                    <p className="mt-2 max-w-[220px] text-sm leading-6 text-brown">{feature.description}</p>
                </div>
            );
        })}
    </div>
    </section>
  );
}
export default WhyChooseUs;
