'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Initialize state from the URL so it persists on reload
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());

        if (searchTerm.trim()) {
            params.set('q', searchTerm.trim());
        } else {
            params.delete('q'); // Clear it if the input is empty
        }

        // Push the new URL without refrshing the page
        router.push(`/properties?${params.toString()}`);
        setSearchTerm("");
    };

    return (
        <form onSubmit={handleSearch} className="flex w-full max-w-2xl mx-auto gap-2">
            <div className="relative grow">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search properties..."
                    className="w-full bg-blue-100/20 border border-blue-600 text-gray-800 px-4
                    py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600
                    placeholder-gray-400 transition-all"
                />
            </div>
            <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-400 text-white font-bold
                rounded-lg transition-colors"
            >
                Search
            </button>
        </form>
    );
}