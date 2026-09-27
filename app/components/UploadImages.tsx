'use client';

import { useState } from 'react';

export default function UploadImages({ propertyId }: { propertyId: string}) {
    const [files, setFiles] = useState<FileList | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFiles(e.target.files);
            // Clear any previous messages
            setMessage(null); 
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!files || files.length === 0) return;

        setIsUploading(true);
        setMessage(null);

        // Pack the files into a FormData object
        const formData = new FormData();
        Array.from(files).forEach((file) => {
            // 'images' must match the Multer upload.array('images') key
            formData.append('images', file);
        });

        try {
            const token = localStorage.getItem('agent_id');

            // Send the request to the server
            const res = await fetch(`http://localhost:3000/api/properties/${propertyId}/images`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                    // No Content-Type is necessary here because the browser automatically
                    // sets it to multipart/form-data with the correct boundary.
                },
                body: formData,
            });

            if (!res.ok) {
                throw new Error('Failed to upload images');
            }

            const data = await res.json();
            setMessage({ text: 'Images uploads successfully!', type: 'success' });
            // Reset the input
            setFiles(null);

            // TODO: Update the UI with router.refresh()
        } catch (error) {
            console.error('Upload error:', error);
            setMessage({ text: 'Error uploading imgaes. Please try again.', type: 'error' });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Property Images</h3>

            <form onSubmit={handleUpload} className="space-y-4">
                <div>
                    <label className="block font-medium text-gray-600 mb-2">
                        Select up to 5 images (JPG, PNG, WEBP)
                    </label>
                    <input
                        type="file"
                        multiple
                        accept="image/jpeg, image/png, image/webp"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-600
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-600
                            hover:file:bg-blue-200
                            transition-colors cursor-pointer
                            "
                    />
                </div>

                {message && (
                    <div className={`p-3 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {message.text}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={!files || isUploading}
                    className="w-full px-4 py-2 text-white bg-blue-600 rounded-md
                    hover:bg-blue-600 disabled:bg-blue-200 disabled:cursor-not-allowed 
                    transition-colors"
                >
                    {isUploading ? 'Uploading images...' : 'Upload Images'}
                </button>
            </form>
        </div>
    );
}
