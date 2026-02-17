"use client";

import { useState, useEffect } from "react";

interface BotConfig {
    id: string;
    name: string;
    status: "running" | "stopped";
    config: any;
    wallet?: {
        address: string;
        balance: number;
        privateKey: string;
    };
    isPrimary?: boolean;
}

export default function BotsPage() {
    const [botType, setBotType] = useState<string | null>(null);
    const [selectedChain, setSelectedChain] = useState<string | null>(null);
    const [bots, setBots] = useState<BotConfig[]>([
        {
            id: "mev",
            name: "MEV Bot",
            status: "stopped",
            config: { gasLimit: "500000", minProfit: "0.5", networks: ["Ethereum", "BSC"] },
            wallet: { address: "0x" + Math.random().toString(16).slice(2, 42), balance: 0, privateKey: "0x" + Math.random().toString(16).slice(2, 66) }
        },
        {
            id: "arbitrage",
            name: "Arbitrage Bot",
            status: "stopped",
            config: { dexes: ["Uniswap", "Sushiswap"], minProfit: "0.3", maxGas: "150" },
            wallet: { address: "0x" + Math.random().toString(16).slice(2, 42), balance: 0, privateKey: "0x" + Math.random().toString(16).slice(2, 66) }
        },
        {
            id: "volume",
            name: "Volume Pump Bot",
            status: "stopped",
            config: { targetToken: "", volumeTarget: "100000", distribution: "Random", walletCount: "10" },
            wallet: { address: "0x" + Math.random().toString(16).slice(2, 42), balance: 0, privateKey: "0x" + Math.random().toString(16).slice(2, 66) }
        },
    ]);

    useEffect(() => {
        const storedBotType = localStorage.getItem("nodepoint_bot_type");
        const storedWallet = localStorage.getItem("nodepoint_wallet");
        const storedBalance = localStorage.getItem("nodepoint_balance");
        const storedChain = localStorage.getItem("nodepoint_selected_blockchain");

        if (storedChain) setSelectedChain(storedChain);

        if (storedBotType) {
            setBotType(storedBotType);
            // Reorder bots to put the primary one first
            setBots(prevBots => {
                const updated = prevBots.map(b => {
                    const isPrimary = b.name.toLowerCase().includes(storedBotType.toLowerCase());
                    if (isPrimary && storedWallet) {
                        return {
                            ...b,
                            isPrimary,
                            wallet: {
                                address: storedWallet,
                                balance: parseFloat(storedBalance || "0"),
                                privateKey: "••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••"
                            }
                        };
                    }
                    return { ...b, isPrimary };
                }).sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0));
                return updated;
            });
        }

        const handleSyncChain = () => {
            const chain = localStorage.getItem("nodepoint_selected_blockchain");
            if (chain) setSelectedChain(chain);
        };
        window.addEventListener('syncBlockchain', handleSyncChain);
        return () => window.removeEventListener('syncBlockchain', handleSyncChain);
    }, []);

    const [configModal, setConfigModal] = useState<{ isOpen: boolean; bot: BotConfig | null }>({ isOpen: false, bot: null });
    const [tempConfig, setTempConfig] = useState<any>({});

    const openConfig = (bot: BotConfig) => {
        setConfigModal({ isOpen: true, bot });
        setTempConfig(bot.config);
    };

    const saveConfig = () => {
        if (configModal.bot) {
            setBots(bots.map(b => b.id === configModal.bot!.id ? { ...b, config: tempConfig } : b));
            setConfigModal({ isOpen: false, bot: null });
        }
    };

    const toggleBot = (id: string) => {
        setBots(bots.map(bot =>
            bot.id === id ? { ...bot, status: bot.status === 'running' ? 'stopped' : 'running' } : bot
        ));
    };

    return (
        <div className="max-w-[1600px] mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">My Bots</h1>
                <p className="text-white/40 font-medium">Manage and configure your automated trading systems.</p>
            </div>

            {/* Bot Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {bots.map((bot) => (
                    <div key={bot.id} className={`p-6 rounded-2xl bg-white/[0.02] border transition-all ${bot.isPrimary ? 'border-blue-500/50 bg-blue-500/[0.02] ring-1 ring-blue-500/20' : 'border-white/5'}`}>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-xl font-bold">{bot.name}</h3>
                                    {bot.isPrimary && (
                                        <span className="px-2 py-0.5 rounded-full bg-blue-500 text-[8px] font-bold text-white uppercase tracking-widest">Active</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${bot.status === 'running' ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
                                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{bot.status}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => toggleBot(bot.id)}
                                className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${bot.status === 'running'
                                    ? 'bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white'
                                    : 'bg-green-500/20 text-green-500 hover:bg-green-500 hover:text-white'
                                    }`}
                            >
                                {bot.status === 'running' ? 'Stop' : 'Start'}
                            </button>
                        </div>

                        {/* Wallet Info */}
                        {bot.wallet && (
                            <div className="mb-6 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-3">Bot Wallet</div>
                                {/* <div className="font-mono text-xs text-blue-400 mb-2 break-all">{bot.wallet.address}</div> */}
                                <div className="text-sm font-bold text-white/80">Balance: {bot.wallet.balance} {selectedChain === 'sol' ? 'SOL' : 'ETH'}</div>
                            </div>
                        )}

                        <button
                            onClick={() => openConfig(bot)}
                            className="w-full py-3 rounded-xl bg-blue-600/20 hover:bg-blue-600 border border-blue-500/20 font-bold text-xs uppercase transition-all"
                        >
                            Settings
                        </button>
                    </div>
                ))}
            </div>

            {/* Configuration Modal */}
            {configModal.isOpen && configModal.bot && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/98 backdrop-blur-3xl">
                    <div className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold">{configModal.bot.name} Settings</h2>
                            <button onClick={() => setConfigModal({ isOpen: false, bot: null })} className="text-white/40 hover:text-white">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {configModal.bot.id === 'volume' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2 block">Token Address</label>
                                    <input
                                        type="text"
                                        value={tempConfig.targetToken || ''}
                                        onChange={(e) => setTempConfig({ ...tempConfig, targetToken: e.target.value })}
                                        placeholder="0x..."
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-blue-500/50 transition-all font-mono text-sm text-white"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2 block">Target Volume (USD)</label>
                                    <input
                                        type="text"
                                        value={tempConfig.volumeTarget || ''}
                                        onChange={(e) => setTempConfig({ ...tempConfig, volumeTarget: e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-blue-500/50 transition-all font-mono text-sm text-white"
                                    />
                                </div>
                            </div>
                        )}

                        {configModal.bot.id === 'mev' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2 block">Min Profit (%)</label>
                                    <input
                                        type="text"
                                        value={tempConfig.minProfit || ''}
                                        onChange={(e) => setTempConfig({ ...tempConfig, minProfit: e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-blue-500/50 transition-all font-mono text-sm text-white"
                                    />
                                </div>
                            </div>
                        )}

                        {configModal.bot.id === 'arbitrage' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2 block">Min Profit (%)</label>
                                    <input
                                        type="text"
                                        value={tempConfig.minProfit || ''}
                                        onChange={(e) => setTempConfig({ ...tempConfig, minProfit: e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-blue-500/50 transition-all font-mono text-sm text-white"
                                    />
                                </div>
                            </div>
                        )}

                        {configModal.bot.wallet && (
                            <div className="mt-8 p-6 rounded-xl bg-white/[0.02] border border-white/5">
                                <div className="text-xs font-bold text-white/20 uppercase tracking-widest mb-4">Account Information</div>
                                <div className="space-y-3">
                                    <div>
                                        <div className="text-xs text-white/40 mb-1">Address</div>
                                        <div className="font-mono text-xs text-blue-400 break-all">{configModal.bot.wallet.address}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-white/40 mb-1">Balance</div>
                                        <div className="font-bold">{configModal.bot.wallet.balance} {selectedChain === 'sol' ? 'SOL' : 'ETH'}</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={saveConfig}
                                className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold text-sm uppercase hover:bg-blue-500 transition-all"
                            >
                                Save Settings
                            </button>
                            <button
                                onClick={() => setConfigModal({ isOpen: false, bot: null })}
                                className="px-8 py-4 bg-white/5 text-white/40 rounded-xl font-bold text-sm uppercase hover:bg-white/10 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
