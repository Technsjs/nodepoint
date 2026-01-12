export default function Privacy() {
    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black pt-32 pb-20 px-6">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
                <div className="space-y-8 text-white/60 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">1. Data Collection</h2>
                        <p>
                            We collect minimal personal information. The primary data we collect is your email address, which is used solely for the delivery of API keys, service updates, and account management. We do not store credit card information or private financial data.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">2. Usage Logs</h2>
                        <p>
                            To maintain service quality and security, we may log technical data such as IP addresses of requests made to our RPC nodes, request frequency, and error rates. This data is used for load balancing and infrastructure optimization.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">3. Data Sharing</h2>
                        <p>
                            NodePoint does not sell, trade, or share your personal information with third parties. We may disclose information only if required by law or to protect our legal rights, property, or safety.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">4. Security</h2>
                        <p>
                            We implement industry-standard security measures to protect your data. All communication with our platform is encrypted via SSL/TLS. API keys are generated using cryptographically secure methods.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">5. Cookies</h2>
                        <p>
                            Our website may use essential cookies to maintain user sessions and preferences. These cookies do not track you across third-party websites.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">6. Your Rights</h2>
                        <p>
                            You have the right to request the deletion of your email from our systems. Upon deletion, your active API keys will be revoked, and access to services will be terminated.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">7. Contact</h2>
                        <p>
                            For any privacy-related inquiries, please contact our support team through the official Telegram channel or the contact button on our homepage.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
