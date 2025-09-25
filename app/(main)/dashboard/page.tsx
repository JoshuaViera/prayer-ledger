// app/(main)/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Prayer Ledger</h1>
          <p className="text-gray-600">Your personal prayer journal</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Welcome to your Dashboard!</h2>
          <p className="text-gray-600 mb-4">
            Authentication is working! This is where your prayer requests will be displayed.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Success!</h3>
            <p className="text-blue-700">
              You have successfully logged in. The prayer management features will be built next.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}