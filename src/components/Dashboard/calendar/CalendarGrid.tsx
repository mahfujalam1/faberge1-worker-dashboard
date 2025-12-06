"use client"

import { cn } from "@/lib/utils"
import { toast } from "sonner"



export default function CalendarGrid({ calenderData, setSelectedDate, setOpen }: { calenderData: any[], setSelectedDate: (date: string) => void, setOpen: (open: boolean) => void }) {
    // console.log(calenderData)
    const getStatusColor = (status: string) => {
        switch (status) {
            case "bg-white":
                return "bg-white shadow-lg  cursor-pointer text-black"
            case "bg-green-500":
                return "bg-green-500 shadow-lg text-white cursor-pointer"
            case "bg-red-500":
                return "bg-red-500 shadow-lg text-white cursor-pointer"
            case "bg-gray-500":
                return "bg-gray-400 shadow-lg text-black cursor-pointer"
            case "bg-gray-200":
                return "bg-gray-200 shadow-lg cursor-not-allowed text-gray-800"
            default:
                return "bg-gray-200 shadow-lg cursor-not-allowed text-gray-800"
        }
    }

    // 🔹 handle click logic
    const handleClick = (date: string, status: string) => {
        setSelectedDate(date)
        if (status === "bg-red-500") {
            toast.warning(`This a weekend date: ${date} is unavailable.`)
        }
        setOpen(true)

        // handleDayClick(date, status)
    }

    // Get the first day of the month (0 = Sunday, 1 = Monday, etc.)
    const firstDay = calenderData.length > 0 ? new Date(calenderData[0].date).getDay() : 0
    // Adjust for Monday-based week (0 = Monday, 6 = Sunday)
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1

    const totalDays = calenderData

    return (
        <div className="grid grid-cols-7 gap-3 sm:gap-4 text-center text-xs sm:text-sm">
            {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d) => (
                <div key={d} className="font-semibold">
                    {d}
                </div>
            ))}

            {Array.from({ length: adjustedFirstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
            ))}

            {Array.from(totalDays)?.map((data, i) => {
                const day = i + 1

                return (
                    <button
                        key={day}
                        onClick={() => handleClick(data?.date, data?.color)}
                        className={cn(
                            "rounded-lg py-3 sm:py-4 text-xs sm:text-sm font-medium transition w-full",
                            getStatusColor(data?.color)
                        )}
                    >
                        {data?.day}
                    </button>
                )
            })}
        </div>
    )
}