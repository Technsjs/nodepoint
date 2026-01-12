export default function Terms() {
    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black pt-32 pb-20 px-6">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">Terms and Conditions</h1>
                <div className="space-y-8 text-white/60 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using NodePoint Technology Solutions (NodePoint), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please refrain from using our services. Our services include but are not limited to RPC node access, arbitrage software, and automated trading bots.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">2. Service Provision</h2>
                        <p>
                            NodePoint provides infrastructure services on an "as-is" and "as-available" basis. We strive for 99.9% uptime but do not guarantee uninterrupted service. We reserve the right to modify, suspend, or terminate any aspect of the service at any time without prior notice.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">3. Payment and Subscriptions</h2>
                        <p>
                            All payments are final. Due to the nature of digital infrastructure and instant provisioning, we do not offer refunds. Payments are processed via cryptocurrency transfers. It is the user's responsibility to ensure the correct amount and network are used for payment.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">4. Prohibited Use</h2>
                        <p>
                            Users may not use our infrastructure for any illegal activities, including but not limited to:
                        </p>
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li>Engaging in DDoS attacks or network stress testing.</li>
                            <li>Attempting to breach the security of our nodes or others.</li>
                            <li>Unauthorized distribution of our proprietary software.</li>
                            <li>Using our services to facilitate money laundering or illegal financing.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">5. Limitation of Liability</h2>
                        <p>
                            NodePoint shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our services. This includes loss of profits, data loss, or trading losses incurred through the use of our arbitrage or forex bots.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">6. Intellectual Property</h2>
                        <p>
                            All code, designs, and content provided through our services are the intellectual property of NodePoint. Users are granted a non-exclusive, non-transferable license to use the services for their personal or business operations as defined by their subscription plan.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">7. Governing Law</h2>
                        <p>
                            These terms are governed by and construed in accordance with international digital commerce standards. Any disputes shall be handled through arbitration as specified by NodePoint legal counsel.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
