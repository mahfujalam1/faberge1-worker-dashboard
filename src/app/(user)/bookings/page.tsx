"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useGetAllStateQuery } from "@/redux/api/bookingApi"
// import { DynamicBanner } from "@/components/shared/DynamicBanner"

export default function BookingsPage() {
  const router = useRouter()
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const { data } = useGetAllStateQuery(undefined)
  const statesData = data?.data || []
  console.log(statesData)

  // ✅ Sort states alphabetically (A → Z)
  const sortedStates = useMemo(() => {
    if (!statesData || statesData.length === 0) return []
    return [...statesData].sort((a, b) =>
      a.name.localeCompare(b.name, "en", { sensitivity: "base" })
    )
  }, [statesData])

  const handleContinue = () => {
    if (selectedState) {
      const state = statesData.find((s: any) => s._id === selectedState)
      if (state) {
        router.push(`/bookings/team-members/${state._id}`)
      }
    }
  }

  return (
    <div>
      {/* <DynamicBanner title="States" /> */}
      <div className="flex items-center justify-center bg-gradient-to-tl from-[#fdeaea] via-[#fff1f3] to-[#ffdae1] p-4 md:p-8">
        <div className="w-full px-6 md:px-10 rounded-[2rem] md:rounded-[3rem]">
          <div className="container mx-auto py-20">
            {/* Title */}
            <h1 className="text-3xl text-center md:text-2xl font-serif mb-5 text-balance">
              Select Your State
            </h1>

            {/* States Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-3">
              {sortedStates.map((state) => (
                <button
                  key={state._id}
                  onClick={() => state?.active && setSelectedState(state?._id)}
                  disabled={!state?.active}
                  className={`
                    px-4 py-3 rounded-lg text-sm font-medium transition-all 
                    ${state.active
                      ? selectedState === state?._id
                        ? "bg-emerald-500 text-white shadow-md"
                        : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 cursor-pointer"
                      : "bg-[#FDE4DB] text-gray-700 cursor-not-allowed shadow-md"
                    }
                  `}
                >
                  {state?.name}
                </button>
              ))}
            </div>

            {/* Continue Button */}
            <div className="flex justify-center">
              <button
                onClick={handleContinue}
                disabled={!selectedState}
                className="bg-primary hover:bg-pink-700 cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-16 py-3 rounded-lg font-medium transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}