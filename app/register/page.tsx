'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match.');
        }

        setLoading(true);

        try {
            const res = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    email: formData.email,
                    password: formData.password
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Registration failed.');
            }

            // Save the token
            localStorage.setItem('agent_id', data.agent_id);

            // Fire the custom event to update the navbar auth status
            window.dispatchEvent(new Event('auth-change'));

            // Send them to the agent dashboard
            router.push('/dashboard');
        } catch (error) {
            setError(`Error occured in registration process: ${error}`)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-gray-200 px-4 py-12">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md border border-gray-100">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800">Agent Registration</h1>
                    <p className="text-gray-600 mt-2">Create your EchelonRealty account</p>
                </div>

                {error && (
                    <div className="p-4 text-red-600 bg-red-50 rounded-md">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-medium text-gray-800">First Name</label>
                        <input
                            type="text"
                            required
                            className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-600 focus:boorder-blue-600"
                            value={formData.first_name}
                            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block font-medium text-gray-800">Last Name</label>
                        <input
                            type="text"
                            required
                            className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-600 focus:boorder-blue-600"
                            value={formData.last_name}
                            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block font-medium text-gray-800">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-600 focus:boorder-blue-600"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block font-medium text-gray-800">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-600 focus:boorder-blue-600"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block font-medium text-gray-800">Confirm Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-600 focus:boorder-blue-600"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                    >
                        {loading ? 'Registering...' : 'Create Account'}
                    </button>
                </form>

                <p className="text-sm text-center text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" className="text-blue-600 hover:underline">
                        Log in here
                    </Link>
                </p>
            </div>
        </div>
    );
}