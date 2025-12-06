"use client"

import { useMemo, useState } from "react"
import CalendarHeader from "./CalendarHeader"
import CalendarGrid from "./CalendarGrid"
import CalendarModal from "./CalendarModal"
import { Button } from "@/components/ui/button"
import UpdateScheduleModal from "./UpdateScheduleModal"
import { useGetCalenderScheduleQuery } from "@/redux/api/calenderApi"


export default function CalendarScheduler() {
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1)
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
    const [selectedDate, setSelectedDate] = useState<string | null>(null)
    const [open, setOpen] = useState(false)
    const [updateModalOpen, setUpdateModalOpen] = useState(false)
    
    const { data } = useGetCalenderScheduleQuery({ year: selectedYear, month: selectedMonth });
    const calenderData = data?.data || [];
    console.log(calenderData)


    return (
        <div className="max-w-xl w-full mx-auto p-6 sm:p-8 bg-white rounded-xl shadow-sm">
            {/* 🔹 Legend */}
            <div className="flex flex-wrap items-center justify-end mb-4 gap-2">
                <div className="flex flex-wrap gap-3 text-xs sm:text-sm">
                    <div className="flex items-center gap-1">
                        <span className="w-3 h-3 bg-white border-2 rounded-full" /> Available
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="w-3 h-3 bg-green-500 rounded-full" /> Booked
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="w-3 h-3 bg-red-500 rounded-full" /> Unavailable
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="w-3 h-3 bg-gray-400  rounded-full" /> Completed
                    </div>
                </div>
            </div>

            {/* 🔹 Calendar Header */}
            <CalendarHeader
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                onMonthChange={setSelectedMonth}
                onYearChange={setSelectedYear}
            />

            {/* 🔹 Calendar Grid */}
            <CalendarGrid calenderData={calenderData} setSelectedDate={setSelectedDate} setOpen={setOpen} />

            {/* 🔹 Update Schedule Button */}
            <div className="flex justify-center mt-6">
                <Button
                    onClick={() => setUpdateModalOpen(true)}
                    className="bg-pink-600 hover:bg-pink-700 px-10 py-6 cursor-pointer w-full sm:w-auto"
                >
                    Update Schedule
                </Button>
            </div>

            {/* 🔹 Modals */}
            <CalendarModal
                open={open}
                onOpenChange={setOpen}
                selectedDate={selectedDate}
                status={
                    selectedDate
                        ? calenderData.find((d:any) => d.date === selectedDate)?.color || null
                        : null
                }
            />

            <UpdateScheduleModal open={updateModalOpen} onOpenChange={setUpdateModalOpen} />
        </div>
    )
}
