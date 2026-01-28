"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function Login() {
    const router = useRouter();
    const [apiKey, setApiKey] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // API Key validation logic
        setTimeout(() => {
            if (apiKey === "josh11111" || apiKey === "22222") {
                const botType = apiKey === "josh11111" ? "Arbitrage" : "MEV";

                // Store auth and bot info in localStorage
                localStorage.setItem("nodepoint_admin", "true");
                localStorage.setItem("nodepoint_api_key", apiKey);
                localStorage.setItem("nodepoint_bot_type", botType);

                router.push("/dashboard");
            } else {
                setError("Invalid API Key. Contact administrator for access.");
                setIsLoading(false);
            }
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 selection:bg-blue-500">
            <div className="w-full max-w-md">
                <div className="text-center mb-12 fade-in">
                    <Link href="/" className="inline-flex items-center gap-4 mb-8 hover:opacity-80 transition-opacity">
                        <Image src="/favicon.png" alt="NodePoint" width={48} height={48} className="rounded-xl shadow-2xl" />
                        <span className="font-bold tracking-tighter text-3xl uppercase">NodePoint</span>
                    </Link>
                    <h1 className="text-3xl font-bold mb-2">User Login</h1>
                    <p className="text-white/40 text-sm font-medium">Please enter your API Key to access your account.</p>
                </div>

                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[50px]"></div>

                    <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                        {error && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/20 uppercase tracking-widest">API Key</label>
                            <input
                                type="text"
                                required
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="Enter your key..."
                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-blue-500/50 transition-all font-bold text-sm text-white"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-5 bg-white text-black rounded-xl font-bold text-sm uppercase hover:bg-blue-600 hover:text-white transition-all shadow-xl disabled:opacity-50"
                        >
                            {isLoading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-white/5 text-center">
                        <p className="text-xs text-white/30">
                            Don't have an API key? <span className="text-white/60 font-bold">Contact support for access.</span>
                        </p>
                        <a href="https://t.me/dePascpo" target="_blank" className="inline-block mt-4 text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors">
                            Contact Support →
                        </a>
                    </div>
                </div>

                <div className="mt-12 text-center text-[10px] font-bold text-white/10 uppercase tracking-widest">
                    Secured by NodePoint
                </div>
            </div>
        </div>
    );
}
