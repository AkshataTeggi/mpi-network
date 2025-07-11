"use client"

export function RoleError({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-48 bg-red-100 rounded-md p-4">
      <h2 className="text-red-600 font-semibold text-lg">Error</h2>
      <p className="text-red-500 text-sm">{error.message}</p>
      <button
        onClick={onRetry}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
      >
        Retry
      </button>
    </div>
  )
}
