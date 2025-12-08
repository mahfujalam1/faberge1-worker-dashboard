"use client"

import { useGetSingleworkerQuery } from "@/redux/api/workerApi"

export default function ServiceSelectionTable({
    slots,
    services,
    selectedSlots,
    onSlotChange,
    onAddOnToggle,
    workerId,
}: any) {
    const { data } = useGetSingleworkerQuery(workerId)
    const workerServices = data?.data?.services || [];
    console.log(workerServices)
    const isServiceSelected = (time: string, service: any) => {
        return selectedSlots?.some((slot: any) => slot.time === time && slot.service._id === service._id)
    }

    const isAddOnSelected = (time: string, service: any, addOn: any) => {
        // Find the slot that matches both time AND the specific service
        const slot = selectedSlots.find((s: any) => s.time === time && s.service._id === service._id)
        // Check if this specific addon is in that slot's addOns array
        return slot?.addOns?.some((a: any) => a._id === addOn._id) || false
    }

    // Filter only available slots and exclude slots with :30 minutes
    const availableSlots = slots.filter((slot: any) => {
        const hasThirtyMinutes = slot.startTime.includes(':30')
        return slot.isAvailable && !slot.isBooked && !slot.isBlocked && !hasThirtyMinutes
    })

    if (availableSlots.length === 0) {
        return (
            <div className="border rounded-lg p-8 text-center">
                <p className="text-gray-500">No available time slots for this date</p>
            </div>
        )
    }

    return (
        <div className="border rounded-lg flex-nowrap overflow-x-auto">
            <div className="w-full">
                <table className="w-full border-collapse">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left py-3 px-4 font-medium text-gray-700 whitespace-nowrap sticky left-0 bg-gray-50 z-10 border-r">
                                Time
                            </th>
                            {services.slice(0, 2).map((service: any) => (
                                <>
                                    <th key={`service-${service?._id}`} className="text-left py-3 px-4 font-medium text-gray-700 whitespace-nowrap min-w-[150px]">
                                        Service
                                    </th>
                                    <th key={`addon-${service?._id}`} className="text-left py-3 px-4 font-medium text-gray-700 whitespace-nowrap min-w-[120px]">
                                        Add-Ons
                                    </th>
                                </>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {availableSlots?.map((slot: any) => {
                            const timeSlot = `${slot.startTime} - ${slot.endTime}`
                            return (
                                <tr key={slot._id} className="hover:bg-gray-50 transition-colors">
                                    {/* Time column - sticky */}
                                    <td className="py-3 px-4 align-top whitespace-nowrap sticky left-0 bg-white border-r z-5">
                                        <span className="text-sm font-medium text-gray-900">{timeSlot}</span>
                                    </td>

                                    {/* Render services (max 2) */}
                                    {services.slice(0, 2).map((service: any) => (
                                        <>
                                            {/* Service */}
                                            <td key={`service-${service?._id}`} className="py-3 px-4 align-top min-w-[150px]">
                                                <label className="flex items-start gap-2 cursor-pointer group">
                                                    <input
                                                        type="checkbox"
                                                        checked={isServiceSelected(timeSlot, service)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                onSlotChange(
                                                                    {
                                                                        time: timeSlot,
                                                                        service: service,
                                                                        addOns: [],
                                                                    },
                                                                    timeSlot,
                                                                    service,
                                                                )
                                                            } else {
                                                                onSlotChange(null, timeSlot, service)
                                                            }
                                                        }}
                                                        className="w-4 h-4 mt-0.5 flex-shrink-0"
                                                    />
                                                    <span className="text-sm whitespace-nowrap group-hover:text-blue-600 transition-colors">
                                                        {service?.service?.serviceName}<br />
                                                        <span className="text-green-600 font-medium">${service?.service?.price}</span>
                                                    </span>
                                                </label>
                                            </td>

                                            {/* Service Add-Ons */}
                                            <td key={`addon-${service?._id}`} className="py-3 px-4 align-top min-w-[120px]">
                                                <div className="space-y-2">
                                                    {service?.service?.subcategory?.map((addon: any) => (
                                                        <label key={addon?._id} className="flex items-start gap-2 cursor-pointer group">
                                                            <input
                                                                type="checkbox"
                                                                checked={isAddOnSelected(timeSlot, service, addon)}
                                                                onChange={() => onAddOnToggle(timeSlot, service, addon)}
                                                                disabled={!isServiceSelected(timeSlot, service)}
                                                                className="w-4 h-4 mt-0.5 flex-shrink-0"
                                                            />
                                                            <span className={`text-xs whitespace-nowrap group-hover:text-blue-600 transition-colors ${!isServiceSelected(timeSlot, service) ? 'text-gray-400' : ''
                                                                }`}>
                                                                {addon?.subcategoryName}<br />
                                                                <span className="text-green-600">+${addon?.subcategoryPrice}</span>
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </td>
                                        </>
                                    ))}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}