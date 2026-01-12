"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Package = {
  id: string;
  name: string;
  price: string;
  isEnterprise?: boolean;
  recommended?: boolean;
  features: string[];
};

type Service = {
  id: string;
  name: string;
  type: "RPC" | "BOT";
  description: string;
  packages: Package[];
};

const SERVICES: Service[] = [
  {
    id: "rpc-eth",
    name: "Ethereum RPC",
    type: "RPC",
    description: "Low-latency access to Ethereum Mainnet nodes.",
    packages: [
      { id: "eth-basic", name: "Basic", price: "$149", features: ["1k req/s", "Shared Node", "Email Support"] },
      { id: "eth-std", name: "Standard", price: "$449", recommended: true, features: ["5k req/s", "Dedicated Node", "WS Support", "Priority Support"] },
      { id: "eth-ent", name: "Enterprise", price: "Custom", isEnterprise: true, features: ["Unlimited", "Private Cluster", "24/7 SLA", "Custom Config"] },
    ],
  },
  {
    id: "rpc-sol",
    name: "Solana RPC",
    type: "RPC",
    description: "High-performance Solana validator access.",
    packages: [
      { id: "sol-basic", name: "Basic", price: "$199", features: ["High-speed", "Public API", "Standard Support"] },
      { id: "sol-std", name: "Standard", price: "$599", recommended: true, features: ["Jito-enabled", "Private IP", "Dedicated Bandwidth", "24/7 Monitoring"] },
      { id: "web3-ent", name: "Enterprise", price: "Custom", isEnterprise: true, features: ["Custom Indexing", "Private VPC", "24/7 Priority Support"] },
    ],
  },
  {
    id: "rpc-kyc",
    name: "KYC Compliance API",
    type: "RPC",
    description: "Institutional grade identity verification and AML screening.",
    packages: [
      { id: "kyc-basic", name: "Basic", price: "$149", features: ["1,000 Verifications", "Standard AML Check", "Webhook Support"] },
      { id: "kyc-std", name: "Standard", price: "$199", recommended: true, features: ["5,000 Verifications", "Enhanced Due Diligence", "Batch Processing"] },
      { id: "kyc-ent", name: "Enterprise", price: "Custom", isEnterprise: true, features: ["Unlimited Verifications", "Biometric Matching", "Dedicated Account Manager"] },
    ],
  },
  {
    id: "rpc-btc",
    name: "Bitcoin Mining API",
    type: "RPC",
    description: "Hashrate management and pool monitoring infrastructure.",
    packages: [
      { id: "btc-basic", name: "Basic", price: "$299", features: ["1 ASIC Node", "Hashrate Alerts", "Daily Stats"] },
      { id: "btc-std", name: "Standard", price: "$899", recommended: true, features: ["10 ASIC Nodes", "Pool Switching", "Auto-Optimization", "24/7 Monitoring"] },
      { id: "btc-ent", name: "Enterprise", price: "Custom", isEnterprise: true, features: ["Unlimited ASICs", "Private Pool Setup", "Custom Firmware Support"] },
    ],
  },
  {
    id: "rpc-web3",
    name: "Web3 Data API",
    type: "RPC",
    description: "Structured on-chain data and indexing services.",
    packages: [
      { id: "web3-basic", name: "Basic", price: "$99", features: ["10k Queries/mo", "5 Chains", "Rest API"] },
      { id: "web3-std", name: "Standard", price: "$399", recommended: true, features: ["500k Queries/mo", "All Chains", "GraphQL + Webhooks", "Priority Data"] },
      { id: "web3-ent", name: "Enterprise", price: "Custom", isEnterprise: true, features: ["Unlimited Queries", "Custom Indexing", "Dedicated Support"] },
    ],
  },
  {
    id: "bot-arb",
    name: "Arbitrage Bot",
    type: "BOT",
    description: "Automated cross-chain arbitrage execution system.",
    packages: [
      { id: "arb-pro", name: "Pro Suite", price: "$850", recommended: true, features: ["Multi-chain", "Flashloan Ready", "Auto-execution", "Profit Tracking", "Lifetime Updates"] },
    ],
  },
  {
    id: "bot-forex",
    name: "Forex Bot",
    type: "BOT",
    description: "Professional grade MT5/MT4 automation bridge.",
    packages: [
      { id: "forex-pro", name: "Elite Bridge", price: "$950", recommended: true, features: ["AI Risk Management", "Ultra-low Latency", "Multi-pair Support", "Institutional Feed", "24/5 Support"] },
    ],
  },
];

type CryptoOption = {
  id: string;
  name: string;
  symbol: string;
  network: string;
  address: string;
  icon: string;
};

const CRYPTO_OPTIONS: CryptoOption[] = [
  { id: "eth", name: "Ethereum", symbol: "ETH", network: "ERC20", address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", icon: "🌐" },
  { id: "btc", name: "Bitcoin", symbol: "BTC", network: "Bitcoin", address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", icon: "₿" },
  { id: "sol", name: "Solana", symbol: "SOL", network: "Solana", address: "H6AR6n5n4Z5Pq5u5u5u5u5u5u5u5u5u5u5u5u5u5", icon: "☀️" },
  { id: "usdt", name: "Tether", symbol: "USDT", network: "ERC20", address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", icon: "💵" },
  { id: "usdt-trc", name: "Tether", symbol: "USDT", network: "TRC20", address: "TR7NHqscv2ba2T6GWcuv5J432vv1324", icon: "💎" },
];

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoOption | null>(null);
  const [step, setStep] = useState<"email" | "confirm" | "payment" | "enterprise">("email");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");

  const [statusModal, setStatusModal] = useState<{ isOpen: boolean; title: string; message: string } | null>(null);

  const openModal = (svc: Service, pkg: Package) => {
    setSelectedService(svc);
    setSelectedPackage(pkg);
    setIsModalOpen(true);
    setStep(pkg.isEnterprise ? "enterprise" : "email");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCrypto(null);
    setEmail("");
    setNote("");
    setSelectedPackage(null);
    setSelectedService(null);
  };

  const handlePaymentSent = async () => {
    // Call our notification API
    try {
      await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          plan: `${selectedService?.name} - ${selectedPackage?.name}`,
          amount: selectedPackage?.price,
          crypto: selectedCrypto?.symbol,
          note
        }),
      });
    } catch (e) {
      console.error("Notification failed", e);
    }

    setIsModalOpen(false);
    setStatusModal({
      isOpen: true,
      title: "RECEIPT CONFIRMED",
      message: "Your payment has been logged for institutional verification. Upon network confirmation, your API key package will be dispatched to your email address."
    });
  };

  const handleEnterpriseSubmit = async () => {
    try {
      await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          plan: `ENTERPRISE INQUIRY: ${selectedService?.name}`,
          amount: "N/A",
          note: note
        }),
      });
    } catch (e) {
      console.error("Inquiry failed", e);
    }

    setIsModalOpen(false);
    setStatusModal({
      isOpen: true,
      title: "INQUIRY DISPATCHED",
      message: "Your requirements have been submitted to our engineering team. A NodePoint representative will contact you via your provided business email within 2-4 hours."
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5 py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image src="/favicon.png" alt="NodePoint" width={32} height={32} className="rounded" />
            <span className="font-bold tracking-tighter text-xl uppercase">NodePoint</span>
          </div>
          <div className="hidden md:flex gap-8 text-[10px] font-black tracking-[0.2em] text-white/40">
            <a href="#rpc" className="hover:text-white transition-colors">INFRASTRUCTURE</a>
            <a href="#bots" className="hover:text-white transition-colors">TRADING BOTS</a>
            <a href="#staking" className="hover:text-white transition-colors">STAKING</a>
            <Link href="/docs" className="hover:text-white transition-colors">DOCS</Link>
          </div>
          <Link href="/login" className="px-5 py-2 rounded border border-white/10 text-[10px] font-black tracking-widest hover:bg-white hover:text-black transition-all uppercase">LOGIN</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-44 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/hero-bg.png" alt="" fill className="object-cover opacity-10 grayscale" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10 fade-in">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black tracking-[0.2em] text-blue-400 mb-8 uppercase italic">Institutional Network Access</div>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.9]">Fueling the <br /><span className="text-white/20 italic">Global Nodes.</span></h1>
          <p className="text-lg text-white/40 max-w-xl mx-auto mb-10 font-medium">Enterprise RPC clusters, Bitcoin mining infrastructure, and high-frequency trading bots for the modern institution.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#rpc" className="px-10 py-5 bg-white text-black rounded font-bold hover:bg-neutral-200 transition-all text-sm uppercase tracking-widest">Pricing & Plans</a>
            <Link href="/docs" className="px-10 py-5 bg-white/5 border border-white/10 rounded font-bold hover:bg-white/10 transition-all text-sm uppercase tracking-widest">Documentation</Link>
          </div>
        </div>
      </section>

      {/* RPC Section */}
      <section id="rpc" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl font-bold tracking-tighter uppercase italic mb-4">/ Infrastructure</h2>
            <p className="text-white/30 font-medium">Scalable node access for developers and operators.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {SERVICES.filter(s => s.type === "RPC").map(service => (
              <div key={service.id} className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-[1px] bg-blue-500"></div>
                  <h3 className="text-xl font-bold uppercase tracking-widest text-white/80">{service.name}</h3>
                </div>
                <div className="flex overflow-x-auto pb-8 snap-x snap-mandatory flex-nowrap sm:grid sm:grid-cols-3 gap-6 -mx-6 px-6 sm:mx-0 sm:px-0">
                  {service.packages.map(pkg => (
                    <div key={pkg.id} className={`snap-center shrink-0 w-[85%] sm:w-auto p-6 rounded-2xl border ${pkg.recommended ? 'border-blue-500/50 bg-blue-500/[0.05]' : 'border-white/5 bg-white/[0.02]'} flex flex-col group hover:bg-white/[0.04] transition-all`}>
                      <div className="text-[10px] font-black tracking-widest text-white/30 mb-2 uppercase">{pkg.name}</div>
                      <div className="text-2xl font-bold mb-6 tracking-tight">{pkg.price}</div>

                      <ul className="space-y-3 mb-8 flex-grow">
                        {pkg.features.map((f, i) => (
                          <li key={i} className="text-[10px] font-bold text-white/40 uppercase tracking-tight flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-blue-500/40"></div> {f}
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() => openModal(service, pkg)}
                        className={`w-full py-3 rounded text-[10px] font-black tracking-widest uppercase transition-all ${pkg.recommended ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-white/10 border border-white/5 hover:bg-white hover:text-black'}`}
                      >
                        {pkg.isEnterprise ? 'CONTACT' : 'BUY'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trading Bots Section */}
      <section id="bots" className="py-24 px-6 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl font-bold tracking-tighter uppercase italic mb-4">/ Trading Bots</h2>
            <p className="text-white/30 font-medium">Automated execution for high-frequency strategies.</p>
          </div>
          <div className="space-y-8">
            {SERVICES.filter(s => s.type === "BOT").map(service => (
              <div key={service.id} className="p-8 sm:p-12 rounded-3xl border border-white/5 bg-white/[0.02] hover:border-blue-500/30 transition-all flex flex-col md:flex-row gap-10 items-center overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] -z-10"></div>
                <div className="flex-grow">
                  <div className="inline-block px-3 py-1 bg-blue-600/10 text-blue-500 text-[10px] font-black tracking-widest uppercase mb-4 rounded">READY TO DEPLOY</div>
                  <h3 className="text-3xl sm:text-4xl font-bold mb-4 uppercase tracking-tighter">{service.name}</h3>
                  <p className="text-white/40 text-lg mb-8 max-w-xl leading-relaxed">{service.description}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                    {service.packages[0].features.map((f, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center">
                          <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        </div>
                        <span className="text-[11px] font-bold text-white/50 uppercase tracking-widest">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-full md:w-auto text-center md:text-right bg-white/[0.03] p-10 rounded-2xl border border-white/5">
                  <div className="text-[10px] font-black tracking-widest text-white/20 mb-2 uppercase">LIFETIME LICENSE</div>
                  <div className="text-5xl font-black mb-8 tracking-tighter text-white">{service.packages[0].price}</div>
                  <button
                    onClick={() => openModal(service, service.packages[0])}
                    className="w-full px-12 py-5 bg-white text-black rounded font-black text-xs tracking-widest uppercase hover:bg-blue-600 hover:text-white transition-all shadow-2xl"
                  >
                    GET INSTANT ACCESS
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Staking */}
      <section id="staking" className="py-32 px-6">
        <div className="max-w-7xl mx-auto glass rounded-3xl p-12 md:p-20 border border-white/10 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 blur-[150px]"></div>
          <div className="flex-grow relative z-10">
            <div className="text-blue-500 text-[10px] font-black tracking-[0.4em] uppercase mb-4 italic">Liquidity Staking</div>
            <h2 className="text-4xl md:text-7xl font-bold tracking-tight mb-8">Earn Passive <br /><span className="text-white/20 italic">Rewards.</span></h2>
            <p className="text-white/40 max-w-md text-lg leading-relaxed font-medium">Institutional-grade staking infrastructure coming to NodePoint. Maximize your asset efficiency with 0% gateway fees.</p>
          </div>
          <div className="w-72 h-72 border-2 border-white/5 rounded-full flex items-center justify-center relative z-10 bg-[#050505]">
            <div className="absolute inset-4 animate-pulse bg-blue-500/5 rounded-full border border-blue-500/20"></div>
            <div className="text-center">
              <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-2">EXPECTED APY</div>
              <div className="text-5xl font-black text-white/30 tracking-tighter">18.5%</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-3">
            <Image src="/favicon.png" alt="NodePoint" width={40} height={40} className="rounded" />
            <span className="font-bold tracking-tighter text-2xl uppercase">NodePoint</span>
          </div>
          <div className="flex flex-wrap justify-center gap-10 text-[10px] font-black tracking-widest text-white/30 uppercase">
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <a href="mailto:nodepointnorth@gmail.com" className="hover:text-white transition-colors uppercase">Support</a>
            <a href="https://t.me/dePascpo" target="_blank" className="hover:text-white transition-colors uppercase">Telegram</a>
          </div>
          <p className="text-[10px] font-bold text-white/10 uppercase tracking-[0.2em]">© 2026 NODEPOINT GLOBAL SOLUTIONS</p>
        </div>
      </footer>

      {/* Checkout Modal */}
      {isModalOpen && selectedPackage && selectedService && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 overflow-y-auto bg-black/98 backdrop-blur-2xl">
          <div className="relative w-full max-w-xl bg-[#0a0a0a] border-0 sm:border border-white/10 rounded-none sm:rounded-2xl shadow-3xl overflow-hidden min-h-screen sm:min-h-0 flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0a0a0a] z-10">
              <div className="flex items-center gap-4">
                {step === "payment" && <Image src="/coinbase.png" alt="Coinbase" width={100} height={24} className="h-5 w-auto" />}
                <div className="w-[1px] h-4 bg-white/10"></div>
                <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">SECURE ORDER</span>
              </div>
              <button onClick={closeModal} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white/30 hover:text-white transition-all">✕</button>
            </div>

            <div className="p-6 sm:p-12 flex-grow">
              {step === "email" && (
                <div className="fade-in">
                  <h3 className="text-3xl font-bold mb-2">Delivery Email</h3>
                  <p className="text-white/30 text-sm mb-10 font-medium tracking-tight">Access keys and high-priority updates will be sent here.</p>
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black tracking-widest text-white/20 uppercase">Email Address</label>
                      <input
                        type="email"
                        placeholder="client@firm.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-6 py-5 focus:outline-none focus:border-blue-500/50 transition-all font-bold text-sm tracking-tight text-white"
                      />
                    </div>
                    <button
                      onClick={() => setStep("confirm")}
                      disabled={!email || !email.includes("@")}
                      className="w-full py-5 bg-white text-black rounded-xl font-black transition-all disabled:opacity-30 text-xs tracking-[0.3em] uppercase"
                    >
                      CONTINUE TO REVIEW
                    </button>
                  </div>
                </div>
              )}

              {step === "confirm" && (
                <div className="fade-in">
                  <h3 className="text-3xl font-bold mb-2">Final Review</h3>
                  <p className="text-white/30 text-sm mb-10 font-medium uppercase tracking-[0.2em]">Verify your institutional selection.</p>
                  <div className="border border-white/10 rounded-2xl divide-y divide-white/10 mb-10 overflow-hidden bg-white/[0.01]">
                    <div className="p-6 flex justify-between items-center bg-white/[0.02]">
                      <span className="text-[10px] font-black text-white/30 uppercase">Selection</span>
                      <span className="font-bold text-base">{selectedService.name} <span className="text-white/30">— {selectedPackage.name}</span></span>
                    </div>
                    <div className="p-6 flex justify-between items-center">
                      <span className="text-[10px] font-black text-white/30 uppercase">Delivery</span>
                      <span className="font-bold text-base text-white/70">{email}</span>
                    </div>
                    <div className="p-8 flex justify-between items-center bg-blue-600/5">
                      <span className="text-[10px] font-black text-blue-500 uppercase italic">Amount Due</span>
                      <span className="text-3xl font-black text-white">{selectedPackage.price}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setStep("payment")}
                    className="w-full py-5 bg-blue-600 text-white rounded-xl font-black hover:bg-blue-500 transition-all text-xs tracking-[0.3em] uppercase shadow-lg shadow-blue-600/20"
                  >
                    SELECT PAYMENT ASSET
                  </button>
                </div>
              )}

              {step === "enterprise" && (
                <div className="fade-in">
                  <h3 className="text-3xl font-bold mb-2">Enterprise Inquiry</h3>
                  <p className="text-white/30 text-sm mb-10 font-medium">Customized clustering for global distribution.</p>
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black tracking-widest text-white/20 uppercase">Work Email</label>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-6 py-5 focus:outline-none focus:border-blue-500/50 transition-all font-bold text-sm text-white" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black tracking-widest text-white/20 uppercase">Requirements</label>
                      <textarea rows={4} value={note} onChange={(e) => setNote(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-6 py-5 focus:outline-none focus:border-blue-500/50 transition-all font-bold text-sm text-white" placeholder="Describe your network load..."></textarea>
                    </div>
                    <button onClick={handlePaymentSent} className="w-full py-5 bg-white text-black rounded-xl font-black text-xs tracking-widest uppercase shadow-xl">SUBMIT REQUEST</button>
                  </div>
                </div>
              )}

              {step === "payment" && (
                <div className="fade-in">
                  <div className="mb-10 text-center">
                    <h3 className="text-2xl font-bold mb-2 tracking-tight">Select Payment Asset</h3>
                    <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> Coinbase Commerce Secure
                    </p>
                  </div>

                  {!selectedCrypto ? (
                    <div className="space-y-3">
                      {CRYPTO_OPTIONS.map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => setSelectedCrypto(opt)}
                          className="w-full flex items-center justify-between p-5 rounded-2xl border border-white/10 bg-white/[0.01] hover:bg-white/[0.04] hover:border-blue-500/30 transition-all group"
                        >
                          <div className="flex items-center gap-5">
                            <div className="text-xl w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 group-hover:border-blue-500/20 transition-all">
                              {opt.icon}
                            </div>
                            <div className="text-left">
                              <div className="font-bold text-base text-white/90">{opt.name}</div>
                              <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{opt.network} Network</div>
                            </div>
                          </div>
                          <svg className="w-5 h-5 text-white/10 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-10 animate-in slide-in-from-right-8 duration-500">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => setSelectedCrypto(null)}
                          className="text-[10px] font-black tracking-widest text-white/30 hover:text-white flex items-center gap-3 uppercase transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                          Assets
                        </button>
                        <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-[9px] font-bold text-green-500 uppercase tracking-widest">Awaiting Transfer</div>
                      </div>

                      <div className="bg-blue-600 rounded-[32px] p-10 text-center relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[40px] rotate-12"></div>
                        <div className="text-[10px] font-black tracking-[0.4em] uppercase mb-4 opacity-70">Transfer Total</div>
                        <div className="text-5xl font-black tracking-tighter mb-4">{selectedPackage.price}</div>
                        <div className="text-[11px] font-bold opacity-50 uppercase tracking-[0.2em]">Pay in {selectedCrypto.symbol} ({selectedCrypto.network})</div>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black tracking-widest text-white/20 uppercase">Official {selectedCrypto.name} Address</label>
                          <div className="group relative">
                            <div className="absolute inset-0 bg-blue-500/5 blur-xl group-hover:bg-blue-500/10 transition-all opacity-0 group-hover:opacity-100"></div>
                            <div className="relative flex items-center gap-3">
                              <div className="flex-grow font-mono text-[11px] bg-black p-6 rounded-2xl border border-white/10 break-all leading-relaxed text-blue-400 font-bold tracking-tight">
                                {selectedCrypto.address}
                              </div>
                              <button
                                onClick={() => { navigator.clipboard.writeText(selectedCrypto.address); alert("Address Copied"); }}
                                className="p-6 bg-white/5 rounded-2xl hover:bg-blue-600 hover:text-white transition-all border border-white/5 shrink-0"
                              >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Keys will be dispatched immediately after 1 confirmation.</p>
                        </div>
                        <button
                          onClick={handlePaymentSent}
                          className="w-full py-6 bg-white text-black rounded-2xl font-black text-xs tracking-[0.3em] uppercase hover:bg-blue-600 hover:text-white transition-all shadow-2xl"
                        >
                          I HAVE SENT PAYMENT
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {statusModal?.isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/98 backdrop-blur-3xl animate-in fade-in duration-500">
          <div className="w-full max-w-sm text-center">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-600/40">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-black tracking-tighter mb-4">{statusModal.title}</h3>
            <p className="text-white/40 text-sm font-medium leading-relaxed mb-10">{statusModal.message}</p>
            <button
              onClick={() => setStatusModal(null)}
              className="w-full py-5 bg-white text-black rounded-xl font-black text-[10px] tracking-[0.3em] uppercase hover:bg-blue-600 hover:text-white transition-all shadow-xl"
            >
              RETURN TO NETWORK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
