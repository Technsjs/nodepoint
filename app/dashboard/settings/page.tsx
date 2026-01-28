"use client";

import { useState } from "react";

export default function SettingsPage() {
    const [wallets, setWallets] = useState({
        eth: process.env.NEXT_PUBLIC_ETH_ADDRESS || "",
        btc: process.env.NEXT_PUBLIC_BTC_ADDRESS || "",
        sol: process.env.NEXT_PUBLIC_SOL_ADDRESS || "",
        usdtErc: process.env.NEXT_PUBLIC_USDT_ERC20_ADDRESS || "",
        usdtTrc: process.env.NEXT_PUBLIC_USDT_TRC20_ADDRESS || "",
    });

    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="max-w-[1200px] mx-auto space-y-8">
            <div>
                <h1 className="text-4xl font-bold tracking-tighter uppercase italic mb-2">Platform Settings</h1>
                <p className="text-white/40 font-medium">Configure payment addresses and system preferences</p>
            </div>

            {saved && (
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-bold text-center">
                    ✓ Settings saved successfully
                </div>
            )}

            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 space-y-8">
                <div>
                    <h2 className="text-xl font-bold uppercase tracking-tight mb-6">Payment Wallet Addresses</h2>

                    <div className="space-y-6">
                        <div>
                            <label className="text-[10px] font-black tracking-widest text-white/30 uppercase mb-2 block">Ethereum (ERC20)</label>
                            <input
                                type="text"
                                value={wallets.eth}
                                onChange={(e) => setWallets({ ...wallets, eth: e.target.value })}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-blue-500/50 transition-all font-mono text-sm text-white"
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-black tracking-widest text-white/30 uppercase mb-2 block">Bitcoin</label>
                            <input
                                type="text"
                                value={wallets.btc}
                                onChange={(e) => setWallets({ ...wallets, btc: e.target.value })}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-blue-500/50 transition-all font-mono text-sm text-white"
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-black tracking-widest text-white/30 uppercase mb-2 block">Solana</label>
                            <input
                                type="text"
                                value={wallets.sol}
                                onChange={(e) => setWallets({ ...wallets, sol: e.target.value })}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-blue-500/50 transition-all font-mono text-sm text-white"
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-black tracking-widest text-white/30 uppercase mb-2 block">USDT (ERC20)</label>
                            <input
                                type="text"
                                value={wallets.usdtErc}
                                onChange={(e) => setWallets({ ...wallets, usdtErc: e.target.value })}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-blue-500/50 transition-all font-mono text-sm text-white"
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-black tracking-widest text-white/30 uppercase mb-2 block">USDT (TRC20)</label>
                            <input
                                type="text"
                                value={wallets.usdtTrc}
                                onChange={(e) => setWallets({ ...wallets, usdtTrc: e.target.value })}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-blue-500/50 transition-all font-mono text-sm text-white"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                    <button
                        onClick={handleSave}
                        className="px-8 py-4 bg-blue-600 text-white rounded-xl font-black text-xs tracking-[0.3em] uppercase hover:bg-blue-500 transition-all shadow-xl"
                    >
                        SAVE CHANGES
                    </button>
                </div>
            </div>

            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5">
                <h2 className="text-xl font-bold uppercase tracking-tight mb-6">Telegram Notifications</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02]">
                        <div>
                            <div className="font-bold mb-1">Sale Alerts</div>
                            <div className="text-xs text-white/40">Get notified when users purchase services</div>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02]">
                        <div>
                            <div className="font-bold mb-1">Bot Status</div>
                            <div className="text-xs text-white/40">Receive updates on bot performance</div>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
