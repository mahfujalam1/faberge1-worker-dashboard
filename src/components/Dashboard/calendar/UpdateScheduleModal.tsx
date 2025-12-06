"use client"

import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useAssignOfDayMutation, useGetAvailableSlotQuery, useUpdateAvailabilityMutation } from "@/redux/api/calenderApi"
import { useGetMeQuery } from "@/redux/api/baseApi"
import { toast } from "sonner"


interface CalendarModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function CalendarModal({ open, onOpenChange }: CalendarModalProps) {
    const worker = useGetMeQuery()
    const [selectedDate, setSelectedDate] = useState<Date | undefined>()
    const [selectedTimes, setSelectedTimes] = useState<string[]>([])
    const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false)
    const [isOffDay, setIsOffDay] = useState(false)
    const [isTimeSlotDisabled, setIsTimeSlotDisabled] = useState(false)
    const workerId = worker?.data?.data?._id;
    const dateFormat = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";

    const [updateAvailability, { isLoading }] = useUpdateAvailabilityMutation()
    const [assignOffDay, { isLoading: isAssigningOffDay }] = useAssignOfDayMutation()
    const { data } = useGetAvailableSlotQuery({ workerId, date: dateFormat })
    const availableTimeSlots = data?.data?.slots || [];

    // Set default unavailable slots and off day status when data loads
    useEffect(() => {
        if (availableTimeSlots.length > 0) {
            const unavailableSlots = availableTimeSlots
                .filter((slot: any) => !slot.isAvailable)
                .map((slot: any) => slot.startTime);
            setSelectedTimes(unavailableSlots);
        }

        // Set off day status from API data
        if (data?.data?.isOffDay !== undefined) {
            setIsOffDay(data.data.isOffDay);
        }
    }, [availableTimeSlots, data?.data?.isOffDay]);

    const handleTimeToggle = (time: string) => {
        if (isTimeSlotDisabled) return
        setSelectedTimes((prev) =>
            prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
        )
    }

    const handleSave = async () => {
        if (!selectedDate) return

        try {
            // Call updateAvailability API with date and unavailableSlots (even if empty)
            const data = {
                date: dateFormat,
                unavailableSlots: selectedTimes
            }
            console.log(data)
            const res = await updateAvailability(data)
            console.log(res)

            if (res?.error) {
                toast.error((res.error as any).data?.message)
            } else {
                toast.success(res?.data?.message)
            }

            // Reset after save
            setSelectedDate(undefined)
            setSelectedTimes([])
            setIsTimeDropdownOpen(false)
            setIsOffDay(false)
            setIsTimeSlotDisabled(false)
            onOpenChange(false)
        } catch (error) {
            toast.error("Failed to update availability")
        }
    }

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            setSelectedDate(undefined)
            setSelectedTimes([])
            setIsTimeDropdownOpen(false)
            setIsOffDay(false)
            setIsTimeSlotDisabled(false)
        }
        onOpenChange(newOpen)
    }

    const handleAssignOffDay = async (checked: boolean | string) => {
        const isChecked = typeof checked === 'boolean' ? checked : checked === 'on';
        setIsOffDay(isChecked);

        if (dateFormat) {
            try {
                const res = await assignOffDay({ date: dateFormat })
                console.log(res)
                if (res?.error) {
                    toast.error((res.error as any)?.data.message || "Failed to assign off day")
                } else {
                    toast.success(res?.data?.message)
                }
            } catch (error) {
                toast.error("Failed to assign off day")
            }
        } else {
            toast.error("Date doesn't providing")
        }
    }

    const shouldShowTimeSelection = !!selectedDate && selectedDate >= new Date(new Date().setHours(0, 0, 0, 0))

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Update Unavailability</DialogTitle>
                    <DialogDescription>Select a date and time for unavailability</DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Date Picker */}
                    <div className="space-y-3">
                        <Label>Select Date</Label>
                        <Popover open={isTimeDropdownOpen} onOpenChange={setIsTimeDropdownOpen}>
                            <PopoverTrigger asChild>
                                <button
                                    className={cn(
                                        "w-full px-3 py-2 text-left border border-gray-300 rounded-md bg-white hover:bg-gray-50 flex items-center justify-between",
                                        !selectedDate && "text-gray-400"
                                    )}
                                    onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
                                >
                                    {selectedDate ? (
                                        <span>{format(selectedDate, "PPP")}</span>
                                    ) : (
                                        <span>Select date</span>
                                    )}
                                    <CalendarIcon className="w-4 h-4 opacity-70" />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={(date) => {
                                        setSelectedDate(date)
                                        setIsTimeDropdownOpen(false)
                                    }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Off Day Checkbox */}
                    {shouldShowTimeSelection && (
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="offDay"
                                checked={isOffDay}
                                onCheckedChange={handleAssignOffDay}
                            />
                            <Label
                                htmlFor="offDay"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                                This date are off day
                            </Label>
                        </div>
                    )}

                    {/* Time Selection */}
                    {shouldShowTimeSelection && availableTimeSlots.length > 0 && (
                        <div className="space-y-2 animate-in fade-in-50 duration-200 w-full">
                            <Label>Select Time for unavailability</Label>
                            <div className="relative w-full">
                                <div className={cn(
                                    "relative w-full mt-1 bg-white border border-gray-300 rounded-md shadow-sm",
                                    isTimeSlotDisabled && "opacity-50 pointer-events-none"
                                )}>
                                    <div className="max-h-56 overflow-y-auto divide-y">
                                        {availableTimeSlots?.map((time: any) => {
                                            const isSelected = selectedTimes.includes(time?.startTime)
                                            return (
                                                <div
                                                    key={time?.startTime}
                                                    className={cn(
                                                        "flex items-center space-x-2 px-3 py-2 cursor-pointer hover:bg-gray-100",
                                                        isSelected && "bg-pink-50",
                                                        isTimeSlotDisabled && "cursor-not-allowed"
                                                    )}
                                                    onClick={() => handleTimeToggle(time?.startTime)}
                                                >
                                                    <Checkbox
                                                        checked={isSelected}
                                                        disabled={isTimeSlotDisabled}
                                                        onCheckedChange={() => handleTimeToggle(time?.startTime)}
                                                        className="pointer-events-none"
                                                    />
                                                    <span className="text-sm">{time?.startTime}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => handleOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={!selectedDate || isLoading}
                        className="bg-pink-600 hover:bg-pink-700"
                    >
                        {isLoading ? "Saving..." : "Save"}
                    </Button>
                </DialogFooter>

                <div className="flex flex-wrap gap-3 text-xs sm:text-sm mt-3">
                    <div className="flex items-center gap-1"><span className="w-3 h-3 bg-white border-2 text-black rounded-full" /> Available</div>
                    <div className="flex items-center gap-1"><span className="w-3 h-3 bg-green-400 rounded-full" /> Booked</div>
                    <div className="flex items-center gap-1"><span className="w-3 h-3 bg-red-400 rounded-full" /> Unavailable</div>
                    <div className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-300 rounded-full" /> Completed</div>
                </div>
            </DialogContent>
        </Dialog>
    )
}