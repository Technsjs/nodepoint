"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const DOC_SECTIONS = [
    {
        id: "getting-started",
        title: "Getting Started",
        icon: "🚀",
        content: (
            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-bold mb-4">Introduction</h2>
                    <p className="text-white/50 leading-relaxed">
                        NodePoint is an institutional-grade infrastructure provider. Our documentation covers the full integration of high-performance RPC nodes, Bitcoin mining APIs, and automated trading bots.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="text-blue-500 font-bold mb-2">RPC Connectivity</div>
                        <p className="text-xs text-white/40">Connect to 12+ blockchain networks with 99.9% uptime and low-latency clusters.</p>
                    </div>
                    <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="text-blue-500 font-bold mb-2">Bot Automation</div>
                        <p className="text-xs text-white/40">Deploy cross-chain arbitrage and forex bridging systems with ease.</p>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: "auth",
        title: "Authentication",
        icon: "🔐",
        content: (
            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-bold mb-4">Security Protocol</h2>
                    <p className="text-white/50 leading-relaxed">
                        All requests to NodePoint must be authenticated using your unique API Key. For high-throughput applications, we recommend using the `X-API-KEY` header.
                    </p>
                </div>
                <div className="p-6 rounded-xl bg-black border border-white/10 font-mono text-xs text-blue-400 overflow-x-auto">
                    <span className="text-white/20">// cURL Example</span><br />
                    curl -X GET https://api.nodepoint.io/v1/network/stats \<br />
                    &nbsp;&nbsp;-H "Authorization: Bearer YOUR_API_KEY" \<br />
                    &nbsp;&nbsp;-H "X-API-KEY: YOUR_API_KEY"
                </div>
            </div>
        )
    },
    {
        id: "eth-rpc",
        title: "Ethereum Operations",
        icon: "⟠",
        content: (
            <div className="space-y-8">
                <h2 className="text-2xl font-bold mb-4">Mainnet RPC Methods</h2>
                <p className="text-white/50 leading-relaxed">
                    Our Ethereum clusters support all standard JSON-RPC methods with enhanced support for Flashbots and Mev-Boost headers.
                </p>
                <div className="space-y-6">
                    <div className="border border-white/5 rounded-xl overflow-hidden">
                        <div className="bg-white/[0.03] p-4 font-bold text-sm">eth_sendRawTransaction</div>
                        <div className="p-4 text-xs text-white/40 leading-relaxed">
                            Submits a pre-signed transaction to our high-priority mempool for faster block inclusion.
                        </div>
                    </div>
                    <div className="border border-white/5 rounded-xl overflow-hidden">
                        <div className="bg-white/[0.03] p-4 font-bold text-sm">eth_subscribe (Websockets)</div>
                        <div className="p-4 text-xs text-white/40 leading-relaxed">
                            Real-time event streaming for logs, new pending transactions, and block headers.
                        </div>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: "bots",
        title: "Trading Bot Core",
        icon: "📈",
        content: (
            <div className="space-y-8">
                <h2 className="text-2xl font-bold mb-4">Bot Configuration</h2>
                <p className="text-white/50 leading-relaxed">
                    Whether you are using our Arbitrage or Forex bots, the deployment follows a standardized configuration schema.
                </p>
                <div className="p-6 rounded-xl bg-black border border-white/10 font-mono text-xs text-blue-400 overflow-x-auto whitespace-pre">
                    <span className="text-white/20"># core-config.yaml</span>{"\n"}
                    engine:{"\n"}
                    &nbsp;&nbsp;mode: aggressive{"\n"}
                    &nbsp;&nbsp;max_gas_limit: 500000{"\n"}
                    wallets:{"\n"}
                    &nbsp;&nbsp;eth: env_var(ETH_PRIVATE_KEY){"\n"}
                    &nbsp;&nbsp;sol: env_var(SOL_PRIVATE_KEY)
                </div>
                <div className="p-4 rounded-lg bg-orange-500/5 border border-orange-500/10 text-[10px] text-orange-400 font-bold uppercase tracking-widest leading-relaxed">
                    Critical: Never commit your config files containing private keys to public repositories. Use environment variables.
                </div>
            </div>
        )
    },
    {
        id: "security",
        title: "Network Security",
        icon: "🛡️",
        content: (
            <div className="space-y-8">
                <h2 className="text-2xl font-bold mb-4">DDOS Mitigation</h2>
                <p className="text-white/50 leading-relaxed">
                    NodePoint employs global Anycast networking to distribute traffic. Our infrastructure can withstand massive L7 request floods without impacting your node latency.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { t: "Rate Limiting", d: "Strict per-key quotas" },
                        { t: "IP Whitelisting", d: "Restrict API access" },
                        { t: "Payload Audit", d: "Inspect JSON injection" }
                    ].map((item, i) => (
                        <div key={i} className="p-4 rounded-xl border border-white/5 bg-white/[0.01]">
                            <div className="text-xs font-bold mb-1">{item.t}</div>
                            <div className="text-[10px] text-white/30">{item.d}</div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
];

export default function Docs() {
    const [activeSection, setActiveSection] = useState("getting-started");

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500 pt-32 pb-20 px-6 font-sans">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16">
                {/* Sidebar Navigation */}
                <aside className="w-full lg:w-72 space-y-2 shrink-0">
                    <div className="text-[10px] font-black tracking-[0.2em] text-white/20 uppercase mb-6 px-4">Documentation Overview</div>
                    {DOC_SECTIONS.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all font-bold text-sm tracking-tight ${activeSection === section.id
                                    ? "bg-blue-600/10 text-blue-500 border border-blue-500/20"
                                    : "text-white/40 hover:text-white hover:bg-white/[0.03]"
                                }`}
                        >
                            <span className="text-lg">{section.icon}</span>
                            {section.title}
                        </button>
                    ))}
                    <div className="mt-10 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                        <div className="text-xs font-bold text-white/60 mb-2">Need Help?</div>
                        <p className="text-[10px] text-white/30 leading-relaxed mb-4">Our engineering team is active 24/7 on Telegram for institutional support.</p>
                        <a href="https://t.me/dePascpo" target="_blank" className="w-full h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded transition-all">Support Chat</a>
                    </div>
                </aside>

                {/* Content Area */}
                <main className="flex-grow max-w-3xl animate-in fade-in duration-500">
                    {DOC_SECTIONS.find(s => s.id === activeSection)?.content}

                    <div className="mt-20 pt-10 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center bg-blue-600/5 p-10 rounded-3xl gap-6">
                        <div>
                            <h4 className="font-bold text-lg mb-1 tracking-tight">Ready to integrate?</h4>
                            <p className="text-sm text-white/40 font-medium">Capture institutional-grade data today.</p>
                        </div>
                        <Link href="/" className="px-8 py-4 bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] rounded hover:bg-neutral-200 transition-all">Start Now</Link>
                    </div>
                </main>
            </div>
        </div>
    );
}
