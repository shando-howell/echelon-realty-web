"use client";

import { useState, useEffect } from 'react';

export default function AgentDashboard() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | ''; message: string }>({ 
        type: '', message: '' 
    });

    // Form state (default coordinates set to Jamaica)
    const [formData, setFormData] = useState({
        agent_id: '',
        title: '',
        description: '',
        price: '',
        bedrooms: '',
        bathrooms: '',
        square_feet: '',
        longitude: '-77.9200',
        latitude: '18.4700'
    });

    // Grab the agent_id from localStorage on mount
    useEffect(() => {
        const savedAgentId = localStorage.getItem('agent_id');
        if (savedAgentId) {
            setTimeout(() => {
                setFormData(prev => ({ ...prev, agent_id: savedAgentId }));
            }, 0);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            // Convert string inputs to numbers where required by the backend DTO
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                bedrooms: parseInt(formData.bedrooms),
                bathrooms: parseFloat(formData.bathrooms),
                square_feet: parseInt(formData.square_feet),
                longitude: parseFloat(formData.longitude),
                latitude: parseFloat(formData.latitude),
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to create listing.');
            }

            setStatus({ type: 'success', message: 'Property successfully listed!.' });

            // Reset form after success (except agent_id retrieved from DB)
            setFormData(prev => ({
                ...prev,
                title: '',
                description: '',
                price: '',
                bedrooms: '',
                bathrooms: '',
                square_feet: '',
            }));

        // eslint-disable-next-line
        } catch (error: any) {
            setStatus({ type: 'error', message: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200
            overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-200 bg-gray-50">
                    <h1 className="text-2xl font-bold text-gray-800">Add a new listing.</h1>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        {/* Status Messages */}
                        {status.message && (
                            <div className={`p-4 rounded-md text-sm ${
                                status.type === 'success' 
                                ? 'bg-green-50 text-green-800'
                                : 'bg-red-50 text-red-800'
                            }`}>
                                {status.message}
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-800">Agent ID</label>
                                <input
                                    type="text"
                                    name="agent_id"
                                    required
                                    readOnly
                                    value={formData.agent_id}
                                    onChange={handleChange}
                                    placeholder="Authenticating..."
                                    className="mt-1 block w-full rounded-md border-gray-200 shadow-sm 
                                    focus:outline-none sm:text-sm p-2 text-gray-600 border cursor-not-allowed"
                                />
                                <p className="text-xs text-gray-600 mt-1">
                                    Agent ID is securely locked to your active session.
                                </p>
                            </div>

                            {/* Title & Price */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-800">Property Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-200 shadow-sm 
                                    focus:border-blue-600 focus:ring-blue-600 sm:text-sm p-2 border"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-800">Price ($)</label>
                                <input
                                    type="number"
                                    name="price"
                                    step="0.01"
                                    required
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-200 shadow-sm 
                                    focus:border-blue-600 focus:ring-blue-600 sm:text-sm p-2 border"
                                />
                            </div>

                            {/* Bedrooms, Bathrooms, SqFt */}
                            <div>
                                <label className="block text-sm font-medium text-gray-800">Square Feet</label>
                                <input
                                    type="number"
                                    name="square_feet"
                                    required
                                    value={formData.square_feet}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-200 shadow-sm 
                                    focus:border-blue-600 focus:ring-blue-600 sm:text-sm p-2 border"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-800">Bedrooms</label>
                                <input
                                    type="number"
                                    name="bedrooms"
                                    required
                                    value={formData.bedrooms}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-200 shadow-sm 
                                    focus:border-blue-600 focus:ring-blue-600 sm:text-sm p-2 border"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-800">Bathrooms</label>
                                <input
                                    type="number"
                                    name="bathrooms"
                                    required
                                    value={formData.bathrooms}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-200 shadow-sm 
                                    focus:border-blue-600 focus:ring-blue-600 sm:text-sm p-2 border"
                                />
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-medium text-gray-800">Longitude</label>
                                <input
                                    type="number"
                                    name="longitude"
                                    step="any"
                                    required
                                    value={formData.longitude}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-200 shadow-sm 
                                    focus:border-blue-600 focus:ring-blue-600 sm:text-sm p-2 border"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-800">Latitude</label>
                                <input
                                    type="number"
                                    name="latitude"
                                    step="any"
                                    required
                                    value={formData.latitude}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-200 shadow-sm 
                                    focus:border-blue-600 focus:ring-blue-600 sm:text-sm p-2 border"
                                />
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-800">Description</label>
                                <textarea
                                    name="description"
                                    rows={4}
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-200 shadow-sm 
                                    focus:border-blue-600 focus:ring-blue-600 sm:text-sm p-2 border"
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent
                                rounded-md shadow-sm font-medium text-white bg-blue-600 hover:bg-blue-400
                                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 
                                disabled:bg-blue-200 transition-colors"
                            >
                                {loading ? 'Submitting...' : 'List Property'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}