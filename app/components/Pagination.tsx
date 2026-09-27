'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface PaginationProps {
    totalPages: number;
    currentPage: number;
}

export default function Pagination({ totalPages, currentPage }: PaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const handlePageChange = (newPage: number) => {
        // Clone current parameters to keep track of the search query
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());

        // Scroll to top and push new URL
        window.scrollTo({ top: 0, behavior: 'smooth' });
        router.push(`${pathname}?${params.toString()}`);
    };

    // Don't render pagination if there's only 1 page
    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-4 mt-12 mb-8">
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50
                disabled:cursor-not-allowed hover:bg-blue-400 transition-colors"
            >
                Previous
            </button>

            <span className="text-gray-400 font-medium">
                Page <span className="text-blue-400">{currentPage}</span> of {totalPages}
            </span>

            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50
                disabled:cursor-not-allowed hover:bg-blue-400 transition-colors"
            >
                Next
            </button>
        </div>
    );
}