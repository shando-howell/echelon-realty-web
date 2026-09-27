"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';

import AIChat from '../components/AIChat';
import AIChatStream from '../components/AIChatStream';

// Dynamically load the Map component, completely disabling SSR
const MapComponent = dynamic(() => import('../components/Map'), {
    ssr: false,
    loading: () => <div className="h-125 w-full bg-gray-200 rounded-xl animate-pulse flex items-center justify-center">Loading map...</div>
});

interface Property {
    id: string;
    title: string;
    price: string;
    bedrooms: number;
    bathrooms: string;
    // square_feet: number;
    status: string;
    longitude: number;
    latitude: number;
}

export default function SearchPage() {
    const [lng, setLng] = useState<string>('-77.9200');
    const [lat, setLat] = useState<string>('18.4700');
    const [radius, setRadius] = useState<string>('10');

    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/properties/search?lng=${lng}&lat=${lat}&radius=${radius}`
            );

            if (!res.ok) throw new Error('Failed to fetch properties.');

            const data = await res.json();
            setProperties(data);
            // eslint-disable-next-line
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-blue-600">Smart Map</h1>
                    <p className="text-gray-600 italic">Search for properties using coordinates or ask the AI assistant to search for properties at a specific location.</p>
                </header>

                <div className="grid grid-cols1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Search Controls */}
                    <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100
                    h-fit">
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div>
                                <label className="block font-medium text-gray-800">Longitude</label>
                                <input
                                    type="number"
                                    step="any"
                                    value={lng}
                                    onChange={(e) => setLng(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-blue-600
                                    focus:ring-blue-600 sm:text-sm p-2 border"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-800">Latitude</label>
                                <input
                                    type="number"
                                    step="any"
                                    value={lat}
                                    onChange={(e) => setLat(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-blue-600
                                    focus:ring-blue-600 sm:text-sm p-2 border"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-800">Radius (Miles)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={radius}
                                    onChange={(e) => setRadius(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-blue-600
                                    focus:ring-blue-600 sm:text-sm p-2 border"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm
                                text-sm font-medium text-white bg-blue-600 hover:bg-blue-400 focus:outline-none focus:ring-2 
                                focus:ring-offset-2 focus:ring-blue-600 disabled:bg-blue-200"
                            >
                                {loading ? 'Searching...' : 'Search Properties'}
                            </button>
                        </form>
                        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
                    </div>

                    {/* Right Column: Results Grid */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* The Dynamic Map */}
                        <MapComponent
                            properties={properties}
                            centerLat={parseFloat(lat)}
                            centerLng={parseFloat(lng)}
                            radiusInMiles={parseFloat(radius)}
                            onMapClick={(newLat, newLng) => {
                                // Automatically update the form state when the map is clicked
                                setLat(newLat.toFixed(6));
                                setLng(newLng.toFixed(6));
                            }}
                        />

                        <div>
                            {/* Standard AI chat component */}
                            {/* <AIChat onPropertiesFound={(props) => setProperties(props)} /> */}

                            {/* SSE chat component */}
                            <AIChatStream onPropertiesFound={(props) => setProperties(props)}/>
                        </div>

                        {properties.length === 0 && !loading && (
                            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                                <p className="text-gray-600">No properties found in this radius.</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {properties.map((property) => (
                                <div key={property.id} className="bg-white rounded-xl shadow-sm border border-gray-200
                                overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="p-6">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-lg font-bold text-gray-900 truncate pr-4">{property.title}</h3>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-medium 
                                            bg-green-200 text-green-800 uppercase tracking-wide">
                                                {property.status}
                                            </span>
                                        </div>
                                        <p className="text-2xl font-extrabold text-blue-600 mt-2">
                                            ${Number(property.price).toLocaleString()}
                                        </p>

                                        <div className="mt-4 flex items-center text-gray-600 space-x-4 border-t pt-4">
                                            <span>{property.bedrooms} Beds</span>
                                            <span>{property.bathrooms} Baths</span>
                                            {/* <span>{property.square_feet.toLocaleString()} Sq Ft</span> */}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}