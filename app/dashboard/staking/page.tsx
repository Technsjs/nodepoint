"use client";

import { useState } from "react";

interface StakingPosition {
    id: string;
    asset: string;
    amount: number;
    apy: number;
    rewards: number;
    startDate: Date;
    status: "active" | "unstaking";
}

export default function StakingPage() {
    const [positions, setPositions] = useState<StakingPosition[]>([]);
    const [depositModal, setDepositModal] = useState<{ isOpen: boolean; asset: string | null }>({ isOpen: false, asset: null });
    const [depositAmount, setDepositAmount] = useState("");
    const [selectedDuration, setSelectedDuration] = useState("30");

    const stakingOptions = [
        { asset: "ETH", apy: 4.2, minStake: 0.1, icon: "🌐", balance: 2.5 },
        { asset: "BTC", apy: 3.8, minStake: 0.01, icon: "₿", balance: 0.15 },
        { asset: "SOL", apy: 7.1, minStake: 1, icon: "☀️", balance: 125 },
        { asset: "USDT", apy: 12.5, minStake: 100, icon: "💵", balance: 5000 },
    ];

    const durations = [
        { days: "30", bonus: "0%", label: "30 Days" },
        { days: "90", bonus: "+1%", label: "90 Days" },
        { days: "180", bonus: "+2%", label: "180 Days" },
        { days: "365", bonus: "+3%", label: "1 Year" },
    ];

    const openDeposit = (asset: string) => {
        setDepositModal({ isOpen: true, asset });
        setDepositAmount("");
        setSelectedDuration("30");
    };

    const handleDeposit = () => {
        if (depositModal.asset && depositAmount) {
            const option = stakingOptions.find(o => o.asset === depositModal.asset);
            if (option) {
                const newPosition: StakingPosition = {
                    id: Math.random().toString(36),
                    asset: depositModal.asset,
                    amount: parseFloat(depositAmount),
                    apy: option.apy + (selectedDuration === "90" ? 1 : selectedDuration === "180" ? 2 : selectedDuration === "365" ? 3 : 0),
                    rewards: 0,
                    startDate: new Date(),
                    status: "active"
                };
                setPositions([...positions, newPosition]);
                setDepositModal({ isOpen: false, asset: null });
            }
        }
    };

    const handleUnstake = (id: string) => {
        setPositions(positions.map(p => p.id === id ? { ...p, status: "unstaking" } : p));
        setTimeout(() => {
            setPositions(positions.filter(p => p.id !== id));
        }, 2000);
    };

    const totalStaked = positions.reduce((sum, p) => sum + p.amount, 0);
    const totalRewards = positions.reduce((sum, p) => sum + p.rewards, 0);

    return (
        <div className="max-w-[1600px] mx-auto space-y-8">
            <div>
                <h1 className="text-4xl font-bold tracking-tighter uppercase italic mb-2">Staking Dashboard</h1>
                <p className="text-white/40 font-medium">Stake your assets and earn passive rewards</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="text-3xl font-black tracking-tighter mb-1">${(totalStaked * 2750).toLocaleString()}</div>
                    <div className="text-[10px] font-black tracking-widest text-white/30 uppercase">Total Staked Value</div>
                </div>
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="text-3xl font-black tracking-tighter text-green-500 mb-1">${(totalRewards * 2750).toLocaleString()}</div>
                    <div className="text-[10px] font-black tracking-widest text-white/30 uppercase">Total Rewards</div>
                </div>
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="text-3xl font-black tracking-tighter text-blue-500 mb-1">{positions.length}</div>
                    <div className="text-[10px] font-black tracking-widest text-white/30 uppercase">Active Positions</div>
                </div>
            </div>

            {/* Staking Options */}
            <div>
                <h2 className="text-xl font-bold uppercase tracking-tight mb-6">Available Staking Pools</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stakingOptions.map((option) => (
                        <div key={option.asset} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-all">
                            <div className="text-3xl mb-4">{option.icon}</div>
                            <div className="text-xl font-bold mb-2 uppercase tracking-tight">{option.asset}</div>
                            <div className="flex items-baseline gap-2 mb-4">
                                <span className="text-2xl font-black text-green-500">{option.apy}%</span>
                                <span className="text-xs text-white/40 uppercase tracking-widest font-bold">APY</span>
                            </div>
                            <div className="text-xs text-white/40 mb-4">
                                <div>Min Stake: {option.minStake} {option.asset}</div>
                                <div>Your Balance: {option.balance} {option.asset}</div>
                            </div>
                            <button
                                onClick={() => openDeposit(option.asset)}
                                className="w-full py-3 rounded-xl bg-blue-600/20 hover:bg-blue-600 border border-blue-500/20 font-black text-[10px] tracking-widest uppercase transition-all"
                            >
                                STAKE {option.asset}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Active Positions */}
            {positions.length > 0 && (
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                    <h2 className="text-xl font-bold uppercase tracking-tight mb-6">Your Positions</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="text-left py-3 px-4 text-[10px] font-black tracking-widest text-white/30 uppercase">Asset</th>
                                    <th className="text-right py-3 px-4 text-[10px] font-black tracking-widest text-white/30 uppercase">Amount</th>
                                    <th className="text-right py-3 px-4 text-[10px] font-black tracking-widest text-white/30 uppercase">APY</th>
                                    <th className="text-right py-3 px-4 text-[10px] font-black tracking-widest text-white/30 uppercase">Rewards</th>
                                    <th className="text-center py-3 px-4 text-[10px] font-black tracking-widest text-white/30 uppercase">Status</th>
                                    <th className="text-center py-3 px-4 text-[10px] font-black tracking-widest text-white/30 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {positions.map((pos) => (
                                    <tr key={pos.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                        <td className="py-4 px-4 font-bold">{pos.asset}</td>
                                        <td className="py-4 px-4 text-right font-mono text-sm">{pos.amount}</td>
                                        <td className="py-4 px-4 text-right text-blue-500 font-bold">{pos.apy}%</td>
                                        <td className="py-4 px-4 text-right text-green-500 font-bold text-sm">{pos.rewards.toFixed(4)} {pos.asset}</td>
                                        <td className="py-4 px-4 text-center">
                                            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase ${pos.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                                                }`}>
                                                {pos.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <button
                                                onClick={() => handleUnstake(pos.id)}
                                                className="px-4 py-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white font-black text-[10px] tracking-widest uppercase transition-all"
                                            >
                                                UNSTAKE
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Deposit Modal */}
            {depositModal.isOpen && depositModal.asset && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/98 backdrop-blur-3xl">
                    <div className="w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-2xl p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold uppercase tracking-tight">Stake {depositModal.asset}</h2>
                            <button onClick={() => setDepositModal({ isOpen: false, asset: null })} className="text-white/40 hover:text-white">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black tracking-widest text-white/30 uppercase mb-2 block">Amount to Stake</label>
                                <input
                                    type="number"
                                    value={depositAmount}
                                    onChange={(e) => setDepositAmount(e.target.value)}
                                    placeholder={`Min: ${stakingOptions.find(o => o.asset === depositModal.asset)?.minStake} ${depositModal.asset}`}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-blue-500/50 transition-all font-mono text-lg text-white"
                                />
                                <div className="mt-2 text-xs text-white/40">
                                    Available: {stakingOptions.find(o => o.asset === depositModal.asset)?.balance} {depositModal.asset}
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black tracking-widest text-white/30 uppercase mb-3 block">Staking Duration</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {durations.map((dur) => (
                                        <button
                                            key={dur.days}
                                            onClick={() => setSelectedDuration(dur.days)}
                                            className={`p-4 rounded-xl border transition-all ${selectedDuration === dur.days
                                                    ? 'border-blue-500 bg-blue-600/20'
                                                    : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                                                }`}
                                        >
                                            <div className="font-bold mb-1">{dur.label}</div>
                                            <div className="text-xs text-green-500 font-black">{dur.bonus}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {depositAmount && (
                                <div className="p-6 rounded-xl bg-blue-600/10 border border-blue-500/20">
                                    <div className="text-[10px] font-black tracking-widest text-blue-400 uppercase mb-3">Estimated Returns</div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-white/40">Base APY:</span>
                                            <span className="font-bold">{stakingOptions.find(o => o.asset === depositModal.asset)?.apy}%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-white/40">Duration Bonus:</span>
                                            <span className="font-bold text-green-500">{durations.find(d => d.days === selectedDuration)?.bonus}</span>
                                        </div>
                                        <div className="flex justify-between pt-2 border-t border-white/10">
                                            <span className="text-white/40">Total APY:</span>
                                            <span className="font-black text-lg text-green-500">
                                                {(stakingOptions.find(o => o.asset === depositModal.asset)?.apy || 0) +
                                                    (selectedDuration === "90" ? 1 : selectedDuration === "180" ? 2 : selectedDuration === "365" ? 3 : 0)}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleDeposit}
                                disabled={!depositAmount || parseFloat(depositAmount) < (stakingOptions.find(o => o.asset === depositModal.asset)?.minStake || 0)}
                                className="w-full py-4 bg-blue-600 text-white rounded-xl font-black text-xs tracking-[0.3em] uppercase hover:bg-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                CONFIRM STAKE
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
