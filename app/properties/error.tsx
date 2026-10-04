'use client'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
 return (
    <div className="p-10 text-center text-white">
        <h2 className="text-2xl text-red-500 mb-4">Something went wrong connecting to the server.</h2>
        <p className="mb-4 text-gray-400">{error.message}</p>
        <button
            onClick={() => reset()}
            className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-800"
        >
            Try Again
        </button>
    </div>
 )
}