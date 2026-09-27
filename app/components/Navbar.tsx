"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();

    const { isLoggedIn, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        {name: 'All Listings', href: '/properties'},
        {name: 'Smart Map', href: '/smart-map'},
        {name: 'Agent Dashboard', href: '/dashboard'},
    ];

    return (
        <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
            <div className="px-6 sm:px-10 lg:px-8">
                <div className="flex justify-between h-16">

                    {/* Brand Section */}
                    <div className="flex items-center">
                        <Link href="/" className="shrink-0 flex items-center gap-2">
                            <div className="flex items-center justify-center">
                                <span className="text-gray-800 font-bold text-xl">Echelon</span>
                                <span className="font-bold text-xl text-blue-600 tracking-tight">
                                    Realty
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`font-medium transition-colors border-b-2 px-1 py-5 ${
                                        isActive 
                                            ? 'border-blue-600 text-blue-600'
                                            : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-400'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Auth Button */}
                    <div className="hidden md:flex items-center">
                        {isLoggedIn ? (
                            <button
                                onClick={logout}
                                className="px-4 py-2 font-medium text-blue-600 bg-gray-100 rounded-md
                                hover:bg-gray-200 transition-colors"
                            >
                                Sign Out
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium 
                                hover:bg-blue-600 transition-colors shadow-sm"
                            >
                                Agent Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-gray-600 hover:text-gray-800 focus:outline-none"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-gray-200 bg-white">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                                        isActive 
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            )
                        })}
                        <Link
                            href="/login"
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium 
                          hover:bg-blue-600 transition-colors shadow-sm"
                        >
                            Agent Login
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}