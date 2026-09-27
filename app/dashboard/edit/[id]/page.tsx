import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import EditPropertyForm from '@/app/components/EditPropertyForm';

const EditPropertyListing = async ({ params }: { params: Promise<{ id: string }>}) => {
    // Await the dynamic route parameter
    const resolvedParams = await params;
    const propertyId = resolvedParams.id;

    // Grab the JWT cookie from the incoming request
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    // Fetch the single property from Express, manually forwarding the cookie
    const res = await fetch(`http://localhost:3000/api/properties/${propertyId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // How to make server components work with Express JWTs!
            'Cookie': `token=${token}`,
        },
        cache: 'no-store', // Fresh data so the agent knows what's in the DB
    });

    // Handle errors (like 404 Not Found or 403 Forbidden)
    if (!res.ok) {
        if (res.status === 404) return notFound();
        return (
            <div className="min-h-screen bg-white p-8 text-center">
                <h1 className="text-2xl text-red-600 font-bold">
                    Unauthorized or Error fetching property.
                </h1>
            </div>
        );
    }

    // Parse the data and pass it to the client form
    const initialData = await res.json();

    return (
        <div className="flex flex-col p-6">
            <div className="flex flex-col">
                <h1 className="text-blue-600 text-3xl font-bold">Modify Property Listing</h1>
                <p className="text-gray-600 italic">
                    Change your property listing information, add new images or delete the listing.
                </p>
            </div>
            <div className="min-w-4xl mx-auto">
                <EditPropertyForm initialData={initialData} />
            </div>
        </div>
    )
}

export default EditPropertyListing;