// eslint-disable-next-line
export default function PropertyCard({ property }: { property: any }) {
    // Grab the first image or use the placeholder if array is empty
    const coverImage = property.image_urls?.[0] || '/images/placeholder-property.jpg';

    return (
        <div className="flex bg-white border border-gray-200 rounded-lg shadow-sm
        overflow-hidden mt-3 max-w-sm">
            <div 
                className="w-1/3 bg-cover bg-center"
                style={{ backgroundImage: `url(${coverImage})` }}
            />
            <div className="p-4 w-2/3">
                <h4 className="text-sm font-bold text-gray-800 truncate">
                    {property.title}
                </h4>
                <p className="text-blue-600 font-semibold text-sm mt-1">
                    ${Number(property.price).toLocaleString()}
                </p>
                <button className="mt-3 w-full py-1.5 text-xs font-medium text-white
                bg-blue-600 rounded hover:bg-blue-400 transition-colors">
                    View Details
                </button>
            </div>
        </div>
    );
}