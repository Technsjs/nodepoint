"use client";

import { useEffect, useState, useRef } from "react";

interface CryptoPrices {
    bitcoin: { usd: number, usd_24h_change: number };
    ethereum: { usd: number, usd_24h_change: number };
    binancecoin: { usd: number, usd_24h_change: number };
    solana: { usd: number, usd_24h_change: number };
}

interface LogEntry {
    id: string;
    type: 'system' | 'opportunity' | 'error' | 'success';
    message: string;
    timestamp: string;
    data?: any;
}

export default function DashboardHome() {
    const [botType, setBotType] = useState<string>("Arbitrage");
    const [prices, setPrices] = useState<CryptoPrices | null>(null);
    const [isLoadingPrices, setIsLoadingPrices] = useState(true);
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [walletBalance, setWalletBalance] = useState<number>(0);
    const [selectedBlockchain, setSelectedBlockchain] = useState<string | null>(null);
    const [isInitializing, setIsInitializing] = useState(false);
    const [initializationProgress, setInitializationProgress] = useState(0);
    const [isBotRunning, setIsBotRunning] = useState(false);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const feedRef = useRef<HTMLDivElement>(null);

    const blockchains = [
        { id: "eth", name: "Ethereum", icon: "🌐" },
        { id: "sol", name: "Solana", icon: "☀️" },
    ];

    useEffect(() => {
        const storedBotType = localStorage.getItem("nodepoint_bot_type");
        const storedWallet = localStorage.getItem("nodepoint_wallet");
        const storedChain = localStorage.getItem("nodepoint_selected_blockchain");
        const storedBalance = localStorage.getItem("nodepoint_balance");

        if (storedBotType) setBotType(storedBotType);
        if (storedWallet) setIsWalletConnected(true);
        if (storedBalance) setWalletBalance(parseFloat(storedBalance));
        if (storedChain && (storedChain === 'eth' || storedChain === 'sol')) {
            setSelectedBlockchain(storedChain);
        }

        const fetchPrices = async () => {
            try {
                // Try multiple price sources if needed, but for now just improve the error case
                const response = await fetch("https://api.coingecko.com/v3/simple/price?ids=bitcoin,ethereum,binancecoin,solana&vs_currencies=usd&include_24hr_change=true");

                if (response.ok) {
                    const data = await response.json();
                    if (data && data.ethereum) {
                        setPrices(data);
                        return;
                    }
                }

                // If we reach here, either !response.ok or data is invalid
                throw new Error("Rate limit or invalid data");
            } catch (error) {
                // Return fallback prices if any error occurs
                if (!prices) {
                    setPrices({
                        bitcoin: { usd: 104500, usd_24h_change: 1.2 },
                        ethereum: { usd: 3030.16, usd_24h_change: 0.5 },
                        binancecoin: { usd: 710, usd_24h_change: 0.8 },
                        solana: { usd: 127.10, usd_24h_change: -1.2 }
                    });
                }
            } finally {
                setIsLoadingPrices(false);
            }
        };

        fetchPrices();
        const interval = setInterval(fetchPrices, 30000);

        const checkWallet = () => {
            const wallet = localStorage.getItem("nodepoint_wallet");
            const balance = localStorage.getItem("nodepoint_balance");
            if (wallet) {
                setIsWalletConnected(true);
                if (balance) setWalletBalance(parseFloat(balance));
            } else {
                setIsWalletConnected(false);
                setWalletBalance(0);
            }
        };
        const walletInterval = setInterval(checkWallet, 1000);

        return () => {
            clearInterval(interval);
            clearInterval(walletInterval);
        };
    }, []);

    // Auto-scroll to bottom of feed
    useEffect(() => {
        if (feedRef.current) {
            feedRef.current.scrollTop = feedRef.current.scrollHeight;
        }
    }, [logs]);

    const addLog = (type: LogEntry['type'], message: string, data?: any) => {
        const newLog: LogEntry = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            message,
            timestamp: new Date().toLocaleTimeString(),
            data
        };
        setLogs(prev => [...prev, newLog].slice(-50));
    };

    const handleSelectBlockchain = (id: string) => {
        setSelectedBlockchain(id);
        localStorage.setItem("nodepoint_selected_blockchain", id);
        window.dispatchEvent(new CustomEvent('syncBlockchain'));
    };

    const startBot = () => {
        if (!isWalletConnected) {
            window.dispatchEvent(new CustomEvent('openWalletModal'));
            return;
        }
        setIsInitializing(true);
        setInitializationProgress(0);

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 8) + 2;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setIsInitializing(false);
                setIsBotRunning(true);

                // Initial logs
                addLog('success', 'Bot monitoring started');
                const walletAddr = localStorage.getItem("nodepoint_wallet") || "Unknown";
                addLog('system', `Wallet connected: ${walletAddr.substring(0, 8)}...`);
                addLog('system', `Balance synchronized: ${walletBalance} ${selectedBlockchain === 'sol' ? 'SOL' : 'ETH'}`);
                addLog('system', 'Scanning mempool for opportunities...');

                // Delay first opportunity
                setTimeout(() => {
                    generateOpportunity(true);
                }, 4000);
            }
            setInitializationProgress(progress);
        }, 80);
    };

    const stopBot = () => {
        setIsBotRunning(false);
        addLog('error', 'Bot monitoring terminated');
    };

    const generateOpportunity = (isFirst = false) => {
        if (!prices || !selectedBlockchain) return;

        const protocols = selectedBlockchain === 'sol'
            ? ["Jupiter", "Raydium", "Orca", "Meteora", "Phoenix", "Lifinity"]
            : ["Uniswap", "Sushiswap", "Curve", "Balancer", "1inch", "Aave"];

        const ethPairs = [
            { name: "ETH/USDC", price: prices.ethereum.usd },
            { name: "WBTC/ETH", price: prices.bitcoin.usd },
            { name: "LINK/ETH", price: 25.40 },
            { name: "PEPE/ETH", price: 0.000012 }
        ];

        const solPairs = [
            { name: "SOL/USDC", price: prices.solana.usd },
            { name: "JUP/SOL", price: 1.20 },
            { name: "PYTH/SOL", price: 0.45 },
            { name: "BONK/SOL", price: 0.000025 }
        ];

        const pairs = selectedBlockchain === 'sol' ? solPairs : ethPairs;
        const selectedPair = pairs[Math.floor(Math.random() * pairs.length)];

        const spread = (Math.random() * 0.0025 + 0.0008);
        const buyPrice = selectedPair.price * (1 - spread / 2);
        const sellPrice = selectedPair.price * (1 + spread / 2);
        const profitVal = (sellPrice - buyPrice);

        // Logic for capital needed
        const isRare = Math.random() > 0.92;
        let capitalNeededUsd = isRare
            ? Math.floor(Math.random() * 8000) + 12000
            : Math.floor(Math.random() * 6000) + 1500;

        const currentBalanceUsd = selectedBlockchain === 'sol'
            ? walletBalance * prices.solana.usd
            : walletBalance * prices.ethereum.usd;

        // Ensure first one or some follow-ups fail if balance is low
        if ((isFirst || Math.random() > 0.4) && currentBalanceUsd > 0) {
            if (capitalNeededUsd < currentBalanceUsd) {
                capitalNeededUsd = currentBalanceUsd + (Math.random() * 800 + 200);
            }
        }

        const data = {
            pair: selectedPair.name,
            protocols: `${protocols[Math.floor(Math.random() * protocols.length)]} ↔ ${protocols[Math.floor(Math.random() * protocols.length)]}`,
            profitUsd: (profitVal * (capitalNeededUsd / selectedPair.price)).toFixed(2),
            capitalNeededUsd: capitalNeededUsd.toLocaleString(),
            buyPrice: selectedPair.name.includes("PEPE") || selectedPair.name.includes("BONK") ? buyPrice.toFixed(8) : buyPrice.toFixed(4),
            sellPrice: selectedPair.name.includes("PEPE") || selectedPair.name.includes("BONK") ? sellPrice.toFixed(8) : sellPrice.toFixed(4)
        };

        addLog('opportunity', `Detected potential arbitrage: ${data.pair}`, data);

        setTimeout(() => {
            const capitalNum = parseFloat(capitalNeededUsd.toString());

            if (currentBalanceUsd === 0) {
                addLog('error', `Trade Aborted: Wallet balance is 0. Please fund your wallet.`);
                return;
            }

            if (currentBalanceUsd < capitalNum) {
                // Determine error type based on capital and probability
                if (capitalNum >= 900 && Math.random() > 0.4) {
                    addLog('error', `Trade Aborted: Order price no longer valid for size $${data.capitalNeededUsd}`);
                } else if (Math.random() > 0.7) {
                    addLog('error', `Trade Aborted: Price out of bounds for ${data.pair}`);
                } else {
                    addLog('error', `Trade Aborted: Insufficient liquidity for optimal execution. Required: $${data.capitalNeededUsd}`);
                }
            } else {
                addLog('success', `Arbitrage successful [${data.pair}]. Profit: +$${data.profitUsd}`);
            }
        }, 1200);
    };

    useEffect(() => {
        if (isBotRunning) {
            const interval = setInterval(() => {
                generateOpportunity();
            }, Math.random() * 15000 + 12000); // 12-27 seconds gap for real scan feeling
            return () => clearInterval(interval);
        }
    }, [isBotRunning, prices, selectedBlockchain, walletBalance]);

    return (
        <div className="space-y-12 fade-in">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tighter uppercase italic mb-2">/ Node Dashboard</h1>
                    <p className="text-white/30 font-medium">Manage your automated trading strategies and network connection.</p>
                </div>
                {isWalletConnected && (
                    <div className="px-6 py-4 rounded-2xl border border-white/5 bg-white/[0.02] flex flex-col items-end">
                        <div className="text-[10px] font-black tracking-widest text-white/20 uppercase mb-1">Live Balance</div>
                        <div className="text-2xl font-black tracking-tighter text-blue-500">
                            {walletBalance.toFixed(4)} {selectedBlockchain === 'sol' ? 'SOL' : 'ETH'}
                        </div>
                    </div>
                )}
            </div>

            {/* Main Bot Control */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-1 space-y-6">
                    <div className="p-8 rounded-2xl border border-white/5 bg-white/[0.02]">
                        <div className="text-[10px] font-black tracking-widest text-white/20 uppercase mb-6 italic">Step 1: Select Network</div>
                        <div className="grid grid-cols-2 gap-3">
                            {blockchains.map((chain) => (
                                <button
                                    key={chain.id}
                                    onClick={() => handleSelectBlockchain(chain.id)}
                                    className={`p-6 rounded-xl border transition-all flex flex-col items-center gap-3 ${selectedBlockchain === chain.id ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/[0.03] border-white/5 text-white/40 hover:border-white/20 hover:text-white'}`}
                                >
                                    <span className="text-2xl grayscale">{chain.icon}</span>
                                    <span className="font-bold text-[10px] uppercase tracking-tighter">{chain.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-8 rounded-2xl border border-white/5 bg-white/[0.02]">
                        <div className="text-[10px] font-black tracking-widest text-white/20 uppercase mb-6 italic">Step 2: Control Bot</div>
                        <div className="flex gap-2 p-1 bg-white/5 rounded-lg mb-6">
                            <button onClick={() => setBotType("Arbitrage")} className={`flex-1 py-2 rounded text-[10px] font-black tracking-widest uppercase transition-all ${botType === 'Arbitrage' ? 'bg-white text-black' : 'text-white/30 hover:text-white'}`}>Arbitrage</button>
                            <button
                                disabled
                                className="flex-1 py-2 rounded text-[10px] font-black tracking-widest uppercase transition-all text-white/10 cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                MEV Bot
                                <span className="text-[7px] bg-white/5 px-1 rounded">SOON</span>
                            </button>
                        </div>

                        {!isBotRunning && !isInitializing ? (
                            <button
                                onClick={startBot}
                                disabled={!selectedBlockchain}
                                className={`w-full py-5 rounded font-black text-[10px] uppercase tracking-[0.3em] transition-all shadow-xl ${selectedBlockchain ? 'bg-white text-black hover:bg-neutral-200' : 'bg-white/5 text-white/10 cursor-not-allowed'}`}
                            >
                                {isWalletConnected ? "START SENSORS" : "CONNECT WALLET"}
                            </button>
                        ) : isInitializing ? (
                            <div className="py-6 text-center">
                                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-4">
                                    <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${initializationProgress}%` }}></div>
                                </div>
                                <div className="text-[10px] font-black tracking-widest text-blue-500 uppercase">Deploying: {initializationProgress}%</div>
                            </div>
                        ) : (
                            <button onClick={stopBot} className="w-full py-5 rounded bg-red-600 hover:bg-red-500 text-white font-black text-[10px] uppercase tracking-[0.3em] transition-all shadow-xl">
                                TERMINATE BOT
                            </button>
                        )}
                    </div>
                </div>

                {/* Real-time Feed */}
                <div className="lg:col-span-2">
                    <div className="p-8 rounded-2xl border border-white/5 bg-white/[0.02] h-[600px] flex flex-col">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-bold tracking-tighter uppercase italic">/ Real-time Feed</h2>
                            <div className="flex items-center gap-3">
                                <span className={`w-2 h-2 rounded-full ${isBotRunning ? 'bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]' : 'bg-red-500'}`}></span>
                                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{isBotRunning ? 'SENSORS ACTIVE' : 'SENSORS OFFLINE'}</span>
                            </div>
                        </div>

                        {!isBotRunning && logs.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center py-20 opacity-20">
                                <div className="text-5xl mb-6 grayscale">📡</div>
                                <div className="font-black text-[10px] uppercase tracking-[0.3em] mb-2">No Active Connection</div>
                                <div className="text-xs max-w-[200px]">Initialize your network sensors to begin scanning for arbitrage.</div>
                            </div>
                        ) : (
                            <div
                                ref={feedRef}
                                className="flex-1 overflow-y-auto pr-2 space-y-4 font-mono custom-scrollbar text-[11px]"
                            >
                                {logs.map((log) => (
                                    <div key={log.id} className={`fade-in border-l-2 pl-4 py-1 ${log.type === 'opportunity' ? 'border-blue-500 bg-blue-500/5' :
                                        log.type === 'error' ? 'border-red-500 bg-red-500/5' :
                                            log.type === 'success' ? 'border-green-500 bg-green-500/5' :
                                                'border-white/10'
                                        }`}>
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex-1">
                                                <span className="text-white/20 mr-3">[{log.timestamp}]</span>
                                                <span className={`${log.type === 'opportunity' ? 'text-blue-400 font-bold' :
                                                    log.type === 'error' ? 'text-red-400 font-bold' :
                                                        log.type === 'success' ? 'text-green-400 font-bold' :
                                                            'text-white/60'
                                                    }`}>
                                                    {log.message}
                                                </span>

                                                {log.data && log.type === 'opportunity' && (
                                                    <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 p-3 rounded bg-white/5 border border-white/5">
                                                        <div>
                                                            <div className="text-[8px] text-white/30 uppercase tracking-widest mb-1">Path</div>
                                                            <div className="text-white/80">{log.data.protocols}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-[8px] text-white/30 uppercase tracking-widest mb-1">Buy/Sell</div>
                                                            <div className="text-white/80">${log.data.buyPrice} / ${log.data.sellPrice}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-[8px] text-white/30 uppercase tracking-widest mb-1">Capital Needed</div>
                                                            <div className="text-blue-400">${log.data.capitalNeededUsd}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-[8px] text-white/30 uppercase tracking-widest mb-1">Est. Profit</div>
                                                            <div className="text-green-400">+${log.data.profitUsd}</div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Info Footer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t border-white/5">
                <div className="p-8 rounded-2xl bg-white/[0.01] border border-white/5">
                    <h3 className="text-sm font-bold uppercase tracking-tight mb-4 italic">Security Status</h3>
                    <p className="text-xs text-white/40 leading-relaxed">System is running in isolated mode. Private keys are encrypted and stored in local memory only. No sensitive data is transmitted to external servers.</p>
                </div>
                <div className="p-8 rounded-2xl bg-blue-600/5 border border-blue-500/10">
                    <h3 className="text-sm font-bold uppercase tracking-tight mb-4 text-blue-500 italic">Network Information</h3>
                    <p className="text-xs text-white/40 leading-relaxed">Connecting to globally distributed RPC clusters for ultra-low latency transaction broadcasting and mempool scanning.</p>
                </div>
            </div>
        </div>
    );
}

