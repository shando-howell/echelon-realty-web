import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-blue-600 text-white py-10 mx-auto">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Brand & Description */}
                    <div>
                        <h2 className="text-xl font-bold text-white mb-4">EchelonRealty</h2>
                        <p className="text-white leading-relaxed">
                            Discover your next major investment or find your dream home with our powerful
                            AI powered online platform.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="hover:underline">Home</Link>
                            </li>
                            <li>
                                <Link href="/smart-map" className="hover:underline">Smart Map</Link>
                            </li>
                            <li>
                                <Link href="/dashboard" className="hover:underline">Agent Dashboard</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal / Contact */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="#" className="hover:underline">Privacy Policy</Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:underline">Terms of Service</Link>
                            </li>
                            <li>
                                <a href="mailto:support@echelonestate.com" className="hover:underline">Contact Support</a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Copyright Bar */}
                <div className="mt-10 pt-6 border-t border-white text-center text-white">
                    <p>&copy; {currentYear} EchelonRealty. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}