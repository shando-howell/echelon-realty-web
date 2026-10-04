import Link from 'next/link';

import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';

export const dynamic = 'force-dynamic';

// @ts-expect-error "query has an implicit any type"
async function getProperties(query, page) {
    // Fetching the data directly in the component body.
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties?q=${query}&page=${page}`, {
        cache: 'no-store' // Ensure we always get the latest listings on every refresh
    });

    if (!res.ok) {
        throw new Error('Failed to fetch properties.');
    }

    return res.json();
}

export default async function PropertiesPage({ searchParams }: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const resolvedParams = await searchParams;

    const query = typeof resolvedParams.q === 'string' ? resolvedParams.q : '';

    // Extract the page and default to 1
    const page = typeof resolvedParams.page === 'string' ? resolvedParams.page : '1';

    const { properties, pagination } = await getProperties(query, page);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-extrabold text-blue-600">All Listings</h1>
                    <p className="text-gray-600 mt-4 text-lg">Browse our complete portfolio of properties.</p>
                </header>

                <div className="mb-8">
                    <SearchBar />
                </div>

                {properties.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                        <p className="text-gray-600">No properties available at the moment.</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* eslint-disable-next-line */}
                            {properties.map((property: any) => (
                                <div key={property.id} className="bg-white rounded-xl shadow-sm border border-gray-200
                                overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">

                                    {/* Image Placeholder */}
                                    <div className="h-48 bg-gray-200 flex items-center justify-center border-b border-gray-200">
                                        <img src='/images/placeholder-property.jpg' alt="Property Image" />
                                    </div>

                                    <div className="p-6 mt-6 flex flex-col grow">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold text-gray-800 line-clamp-1">
                                                {property.title}
                                            </h3>
                                        </div>
                                    </div>
                                    <p className="px-6 text-3xl font-extrabold text-blue-600 mb-4">
                                        ${Number(property.price).toLocaleString()}
                                    </p>

                                    <div className="flex items-center px-6 text-gray-600 space-x-4 mb-6">
                                        <span>{property.bedrooms} Beds</span>
                                        <span>*</span>
                                        <span>{property.bathrooms} Baths</span>
                                        <span>*</span>
                                        <span>{property.square_feet.toLocaleString()} Sq Ft</span>
                                    </div>

                                    <p className="px-4 text-gray-600 text-sm line-clamp-2 mb-6 grow">
                                        {property.description}
                                    </p>

                                    <Link 
                                        href={`/properties/${property.id}`}
                                        className="w-full bg-blue-50 text-blue-600 font-semibold py-2 text-center hover:bg-blue-200 transition-colors mt-auto"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            ))}
                        </div>

                        <div>
                            <Pagination
                                totalPages={pagination.totalPages}
                                currentPage={pagination.currentPage}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}