'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Property {
    id: number;
    title: string;
    price: number;
    created_at: string;
}

export default function AgentDashboard() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMyListings = async () => {
            try {
                const token = localStorage.getItem('agent_id');
                if (!token) throw new Error('No authentication token found.');

                const res = await fetch('http://localhost:3000/api/listings/my-listings', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!res.ok) throw new Error('Failed to fetch listings');

                const data = await res.json();
                setProperties(data);
            } catch (error) {
                setError(`Error in fetching listings ${error}`);
            } finally {
                setLoading(false);
            }
        };

        fetchMyListings();
    }, []);

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">My Listings</h1>
                <Link
                    href="/dashboard/new"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md gover:bg-blue-400
                    transition-colors"
                >
                    + Add New Property
                </Link>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">{error}</div>
            )}

            <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-600 animate-pulse">
                        Loading listings...
                    </div>
                ) : properties.length === 0 ? (
                    <div className="px-8 py-24 text-xl text-center text-gray-600">
                        You haven&apos;t added any properties yet.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="p-4 font-semibold text-gray-600">Property</th>
                                    <th className="p-4 font-semibold text-gray-600">Price</th>
                                    <th className="p-4 font-semibold text-gray-600">Listed On</th>
                                    <th className="p-4 font-semibold text-gray-600"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {properties.map((prop) => (
                                    <tr key={prop.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-gray-800">{prop.title}</td>
                                        <td className="p-4 text-gray-800">
                                            ${Number(prop.price).toLocaleString()}
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            {new Date(prop.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <Link
                                                href={`/dashboard/edit/${prop.id}`}
                                                className="text-blue-600 hover:text-blue-400 font-medium mr-4"
                                            >
                                                Modify
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}