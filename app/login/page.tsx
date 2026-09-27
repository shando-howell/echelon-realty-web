"use client";

import { useState } from 'react';
import { useRouter, redirect } from 'next/navigation';
import Link from 'next/link';

import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Login failed.');
            }

            // Store the token in a secure, strict cookie that expired in 1 day (86400 seconds)
            document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Strict`;

            // Store the agent_id in localStorage to pre-fill the dashboard form
            login(data.token); 

            // Push route to URL history (route to dashboard)
            router.push("/dashboard")
            // Refresh the current route programmatically (refresh the dashboard route)
            router.refresh()
            // eslint-disable-next-line
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-6 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="text-center text-3xl font-extrabold text-gray-800">
                    Agent Dashboard Login
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200">
                    <form className="space-y-6" onSubmit={handleLogin}>
                        {error && (
                            <div className="bg-red-50 p-4 rounded-md text-red-800">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block font-medium text-gray-800">
                                Email Address
                            </label>
                            <div className="mt-1">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-200
                                    rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-600
                                    focus:border-blue-600 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block font-medium text-gray-800">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-200
                                    rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-600
                                    focus:border-blue-600 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent focus:outline-none
                                rounded-md shadow-sm font-medium text-white bg-blue-600 hover:bg-blue-400 focus:ring-2
                                focus:ring-offset-2 focus:ring-blue-600 disabled:bg-blue-200"
                            >
                                {loading ? 'Authenticating...' : 'Sign In'}
                            </button>
                        </div>
                    </form>

                    <p className="text-sm text-center text-gray-600 py-4">
                        Don&apos;t have an account?{' '}
                        <Link href="/register" className="text-blue-600 hover:underline">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}