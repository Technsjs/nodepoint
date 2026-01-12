"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // Simulate authentication delay
        setTimeout(() => {
            setError("User does not exist in our institutional database.");
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 selection:bg-blue-500">
            <div className="w-full max-w-md">
                <div className="text-center mb-12 fade-in">
                    <Link href="/" className="inline-flex items-center gap-4 mb-8 hover:opacity-80 transition-opacity">
                        <Image src="/favicon.png" alt="NodePoint" width={48} height={48} className="rounded-xl shadow-2xl" />
                        <span className="font-bold tracking-tighter text-3xl uppercase">NodePoint</span>
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight mb-2 uppercase italic">Institutional Access</h1>
                    <p className="text-white/40 text-sm font-medium italic">Enter your credentials to access the node terminal.</p>
                </div>

                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[50px]"></div>

                    <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                        {error && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest text-center animate-pulse">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-black tracking-widest text-white/20 uppercase">Network Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="operator@node.com"
                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-blue-500/50 transition-all font-bold text-sm text-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black tracking-widest text-white/20 uppercase">Security Key</label>
                                <a href="#" className="text-[10px] font-black tracking-widest text-blue-500 uppercase hover:text-blue-400">Forgot?</a>
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-blue-500/50 transition-all font-bold text-sm text-white"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-5 bg-white text-black rounded-xl font-black text-xs tracking-[0.3em] uppercase hover:bg-blue-600 hover:text-white transition-all shadow-xl disabled:opacity-50"
                        >
                            {isLoading ? "Authenticating..." : "LOGIN TO TERMINAL"}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-white/5 text-center">
                        <p className="text-xs text-white/30 font-medium">
                            Don't have an account? <span className="text-white/60 font-bold">Must be referred by existing partner.</span>
                        </p>
                        <Link href="https://t.me/dePascpo" className="inline-block mt-4 text-[10px] font-black tracking-widest text-blue-500 uppercase hover:text-blue-400 transition-colors">
                            Contact Channel Registry →
                        </Link>
                    </div>
                </div>

                <div className="mt-12 text-center text-[10px] font-black tracking-[0.3em] text-white/10 uppercase">
                    Protected by NodePoint Security (Anycast Distributed)
                </div>
            </div>
        </div>
    );
}
