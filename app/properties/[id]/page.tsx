import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PropertyDetailsProps {
    params: Promise<{ id: string }>;
}

async function getProperty(id: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/${id}`, {
        cache: 'no-store'
    });

    if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error('Failed to fetch property details.');
    }

    return res.json();
}


export default async function PropertyDetailsPage({ params }: PropertyDetailsProps) {
    const { id } = await params;

    const property = await getProperty(id);

    if (!property) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Image Area */}
            <div className="w-full h-100 bg-gray-200 border-b border-gray-200 flex items-center
            justify-center">
                {/* <span className="text-gray-600 font-medium text-lg">Property Image Gallery</span> */}
                <img src="/images/placeholder-property.jpg" alt="Placeholder Image" />
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row justify-bewteen items-start md:items-center mb-8 gap-4">
                    <div className="bg-gray-50 py-6 px-8 rounded-2xl">
                        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">{property.title}</h1>
                        <p className="text-4xl font-extrabold text-gray-600">
                            ${Number(property.price).toLocaleString()}
                        </p>
                    </div>
                    <div className="text-right flex flex-row px-28 space-x-8">
                        <p className="inline-block px-4 py-1 bg-green-200 text-green-800 font-semibold rounded-full
                        mt-2 uppercase tracking-wide">
                            {property.status || 'Active'}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Details */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="bg-gray-50 p-6 rounded-2xl border border-gray-200 flex justify-between 
                        items-center text-center">
                            <div>
                                <p className="text-gray-600 font-medium mb-1">Bedrooms</p>
                                <p className="text-2xl font-bold text-gray-800">{property.bedrooms}</p>
                            </div>
                            <div className="w-px h-12 bg-gray-200"></div>
                            <div>
                                <p className="text-gray-600 font-medium mb-1">Bathrooms</p>
                                <p className="text-2xl font-bold text-gray-800">{property.bathrooms}</p>
                            </div>
                            <div className="w-px h-12 bg-gray-200"></div>
                            <div>
                                <p className="text-gray-600 font-medium mb-1">Square Feet</p>
                                <p className="text-2xl font-bold text-gray-800">{property.square_feet.toLocaleString()}</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">About this Property</h2>
                            <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed">
                                <p>{property.description}</p>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar / Agent Info */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm sticky top-24">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Interested in this property?</h3>
                            {/* <p className="text-gray-600 mb-6">
                                Contact the listing agent to schedule a viewing or ask a question.
                            </p>

                            <button className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg
                            hover:bg-blue-400 transition-colors shadow-sm mb-3">
                                Contact Agent
                            </button> */}

                            <Link
                                href="/smart-map"
                                className="w-full flex justify-center bg-gray-50 text-gray-600 font-semibold
                                py-3 rounded-lg hover:bg-gray-200 transition-colors border-gray-200"
                            >
                                View on Map
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}