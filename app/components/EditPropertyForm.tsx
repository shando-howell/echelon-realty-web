'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// eslint-disable-next-line
export default function EditPropertyForm({ initialData }: { initialData: any }) {
    const router = useRouter();
    const [isUpdating, setIsUpdating] = useState(false);

    // Pre-fill state with existing property data
    const [formData, setFormData] = useState({
        title: initialData.title || '',
        price: initialData.price || '',
        bedrooms: initialData.bedrooms || '',
        description: initialData.description || '',
    });

    const [files, setFiles] = useState<FileList | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);

        // Pack everything into FormData
        const submitData = new FormData();
        submitData.append('title', formData.title);
        submitData.append('price', formData.price.toString());
        submitData.append('bedrooms', formData.bedrooms.toString());
        submitData.append('description', formData.description);

        // Append files if the user selected new ones
        if (files) {
            for (let i = 0; i < files.length; i++) {
                submitData.append('newImages', files[i]); // Must match the Multer field name
            }
        }

        // const token = localStorage.getItem('agent_id');

        try {
            // Send without Content-Type header (browser sets it automatically for FormData)
            const res = await fetch(`http://localhost:3000/api/listings/my-listings/${initialData.id}`, {
                method: 'PUT',
                // headers: {
                //     'Authorization': `Bearer ${token}`,
                // },
                credentials: 'include',
                body: submitData,
            });

            if (!res.ok) throw new Error('Failed to update');

            router.push('/dashboard'); // Send them back to the dashboard on success
            router.refresh();
        } catch (error) {
            console.error(error);
        } finally {
            setIsUpdating(false);
        }
    };

    // Handle property delete
    const handleDelete = async () => {
        // Ask for permission before deleting a listing
        const isConfirmed = window.confirm("Are you sure you want to delete this listing? This action cannot be undone.");
        if (!isConfirmed) return;

        try {
            const res = await fetch(`http://localhost:3000/api/listings/my-listings/${initialData.id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!res.ok) throw new Error('Failed to delete property.');

            // Redirect agent to the dashboard, refresh data
            router.push('/dashboard');
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Failed to delete the listing.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-8 bg-white rounded-xl border border-blue-600 flex flex-col gap-6 mt-8">
            <div className="flex flex-col gap-2">
                <label className="text-gray-600 font-medium">Title</label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="bg-gray-100 border border-blue-600 text-gray-800 px-4 py-3 rounded-lg
                    focus:ring-2 focus:ring-blue-600 outline-none"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <label className="text-gray-600 font-medium">Price ($)</label>
                    <input
                        type="number"
                        value={formData.price}
                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                        className="bg-gray-100 border border-blue-600 text-gray-80 px-4 py-3
                        rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                </div>
                 <div className="flex flex-col gap-2">
                    <label className="text-gray-600 font-medium">Bedrooms</label>
                    <input
                        type="number"
                        value={formData.bedrooms}
                        onChange={e => setFormData({ ...formData, bedrooms: e.target.value })}
                        className="bg-gray-100 border border-blue-600 text-gray-800 px-4 py-3
                        rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-gray-600 font-medium">Description</label>
                <textarea
                    rows={4}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="bg-gray-100 border border-blue-600 text-gray-800 px-4 rounded-lg
                    focus:ring-2 focus:ring-blue-600 outline-none"
                />
            </div>

            {/* File upload for new images */}
            {/* <div className="flex flex-col gap-2">
                <label className="text-gray-600 font-medium">Add More Photos</label>
                <input
                    type="file" multiple accept="image/*"
                    onChange={e => setFiles(e.target.files)}
                    className="block w-full not-target:text-gray-600 file:mr-4 file:py-2
                    file:px-4 file:rounded-lg file:border-0 file:font-semibold 
                    file:bg-blue-600/10 file:text-blue-400 hover:file:bg-blue-600/20
                    cursor-pointer"
                />
            </div> */}

            <button
                type="submit"
                disabled={isUpdating}
                className="mt-4 px-6 py-4 bg-green-500 hover:bg-green-400 text-white font-bold
                rounded-lg disabled:opacity-50 transition-colors"
            >
                {isUpdating ? 'Saving Updates...' : 'Save Updates'}
            </button>

            {/* Danger Zone */}
            <div className="mt-12 pt-6 border-t border-red-400/50">
                <h3 className="text-red-600 font-bold mb-2">Danger Zone</h3>
                <button
                    type="button"
                    onClick={handleDelete}
                    className="w-full px-6 py-3 bg-transparent border border-red-400/50 hover:bg-red-400/10
                    text-red-600 font-bold rounded-lg transition-colors"
                >
                    Delete Property Listing
                </button>
            </div>
        </form>
    );
}