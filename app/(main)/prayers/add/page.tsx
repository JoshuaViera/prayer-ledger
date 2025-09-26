import { CreatePrayerForm } from "@/components/prayers/CreatePrayerForm";

export default function AddPrayerPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full">
         <CreatePrayerForm />
      </div>
    </div>
  )
}