"use client";

import { useEffect, useRef } from "react";

interface Package {
    id: string;
    name: string;
    price: string;
    features: string[];
    recommended?: boolean;
    isEnterprise?: boolean;
    disabled?: boolean;
    disabledMessage?: string;
}

interface Service {
    id: string;
    name: string;
    type: "RPC" | "BOT";
    description: string;
    packages: Package[];
}

interface PricingScrollProps {
    service: Service;
    onOpenModal: (service: Service, pkg: Package) => void;
}

export default function PricingScroll({ service, onOpenModal }: PricingScrollProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scroll to recommended card on mobile
        if (scrollRef.current && typeof window !== 'undefined' && window.innerWidth < 640) {
            const recommendedIndex = service.packages.findIndex(pkg => pkg.recommended);
            if (recommendedIndex !== -1) {
                const cardWidth = scrollRef.current.scrollWidth / service.packages.length;
                const scrollPosition = cardWidth * recommendedIndex - (window.innerWidth - cardWidth * 0.85) / 2;
                scrollRef.current.scrollLeft = scrollPosition;
            }
        }
    }, [service.packages]);

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <div className="w-10 h-[1px] bg-blue-500"></div>
                <h3 className="text-xl font-bold uppercase tracking-widest text-white/80">{service.name}</h3>
            </div>
            <div
                ref={scrollRef}
                className="flex overflow-x-auto pb-8 snap-x snap-mandatory flex-nowrap sm:grid sm:grid-cols-3 gap-6 -mx-6 px-6 sm:mx-0 sm:px-0 scroll-smooth"
            >
                {service.packages.map(pkg => (
                    <div
                        key={pkg.id}
                        className={`snap-center shrink-0 w-[85%] sm:w-auto p-6 rounded-2xl border transition-all ${pkg.recommended
                            ? 'border-blue-500/50 bg-blue-500/[0.05]'
                            : pkg.disabled
                                ? 'border-white/5 bg-white/[0.01] grayscale opacity-50'
                                : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04]'
                            } flex flex-col group`}
                    >
                        <div className="text-[10px] font-black tracking-widest text-white/30 mb-2 uppercase">{pkg.name}</div>
                        <div className="text-2xl font-bold mb-6 tracking-tight text-white/90">{pkg.price}</div>

                        <ul className="space-y-3 mb-8 flex-grow">
                            {pkg.features.map((f, i) => (
                                <li key={i} className="text-[10px] font-bold text-white/40 uppercase tracking-tight flex items-center gap-2">
                                    <div className={`w-1 h-1 rounded-full ${pkg.disabled ? 'bg-white/10' : 'bg-blue-500/40'}`}></div> {f}
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => onOpenModal(service, pkg)}
                            className={`w-full py-3 rounded text-[10px] font-black tracking-widest uppercase transition-all ${pkg.disabled
                                ? 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed'
                                : pkg.recommended
                                    ? 'bg-blue-600 text-white hover:bg-blue-500'
                                    : 'bg-white/10 border border-white/5 hover:bg-white hover:text-black'
                                }`}
                        >
                            {pkg.isEnterprise ? 'CONTACT' : 'BUY'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
