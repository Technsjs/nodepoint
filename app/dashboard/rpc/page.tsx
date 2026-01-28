"use client";

export default function RPCPage() {
    const services = [
        { name: "Ethereum RPC", requests: "1.2M", uptime: "99.99%", latency: "45ms", activeKeys: 12 },
        { name: "Solana RPC", requests: "890K", uptime: "99.97%", latency: "38ms", activeKeys: 8 },
        { name: "Bitcoin Mining API", requests: "234K", uptime: "100%", latency: "52ms", activeKeys: 5 },
        { name: "Web3 Data API", requests: "567K", uptime: "99.95%", latency: "67ms", activeKeys: 15 },
        { name: "KYC Compliance API", requests: "89K", uptime: "99.98%", latency: "120ms", activeKeys: 3 },
    ];

    return (
        <div className="max-w-[1600px] mx-auto space-y-8">
            <div>
                <h1 className="text-4xl font-bold tracking-tighter uppercase italic mb-2">RPC Services Monitor</h1>
                <p className="text-white/40 font-medium">Real-time API usage and performance metrics</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {services.map((service, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-all">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold uppercase tracking-tight">{service.name}</h3>
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-2xl font-black tracking-tighter">{service.requests}</div>
                                <div className="text-[10px] font-black tracking-widest text-white/30 uppercase">Requests</div>
                            </div>
                            <div>
                                <div className="text-2xl font-black tracking-tighter text-green-500">{service.uptime}</div>
                                <div className="text-[10px] font-black tracking-widest text-white/30 uppercase">Uptime</div>
                            </div>
                            <div>
                                <div className="text-2xl font-black tracking-tighter text-blue-500">{service.latency}</div>
                                <div className="text-[10px] font-black tracking-widest text-white/30 uppercase">Latency</div>
                            </div>
                            <div>
                                <div className="text-2xl font-black tracking-tighter">{service.activeKeys}</div>
                                <div className="text-[10px] font-black tracking-widest text-white/30 uppercase">Active Keys</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
