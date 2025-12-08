"use client";

import { X } from "lucide-react";
import { BookingCartProps } from "@/types/booking/appointment";

interface Props extends BookingCartProps {
    onRemove?: (index: number) => void;
    onClear?: () => void;
    isLoading: boolean
}

export default function BookingCart({
    isLoading,
    bookings,
    memberName,
    workerId,
    onCheckout,
    onRemove,
    onClear,
}: Props) {
    console.log(bookings)
    if (!bookings || bookings.length === 0)
        return (
            <div className="bg-white rounded-3xl shadow-2xl p-10 text-center text-gray-600 font-medium">
                No bookings added yet.
            </div>
        );

    // 🔹 Total calculation
    const calculateTotal = () => {
        return bookings.reduce((total, booking: any) => {
            const servicePrice = booking.service?.service.price;
            const addOnsPrice = booking.addOns.reduce(
                (sum: number, addon: any) => sum + addon.subcategoryPrice,
                0
            );
            return total + servicePrice + addOnsPrice;
        }, 0);
    };

    return (
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left py-3 px-2 font-medium">Customer</th>
                            <th className="text-left py-3 px-2 font-medium">Date</th>
                            <th className="text-left py-3 px-2 font-medium">Time</th>
                            <th className="text-left py-3 px-2 font-medium">Service</th>
                            <th className="text-left py-3 px-2 font-medium">Add-Ons</th>
                            <th className="text-left py-3 px-2 font-medium">Total</th>
                            <th className="text-center py-3 px-2 font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking: any, index) => {
                            const itemTotal =
                                booking.service?.service.price +
                                booking.addOns.reduce((sum: number, addon: any) => sum + addon.subcategoryPrice, 0);

                            return (
                                <tr
                                    key={index}
                                    className="border-b hover:bg-gray-50 transition text-gray-800"
                                >
                                    <td className="py-3 px-2">{booking.time}</td>
                                    <td className="py-3 px-2">{booking.date}</td>
                                    <td className="py-3 px-2">{booking.time}</td>
                                    <td className="py-3 px-2">
                                        {booking.service?.service?.serviceName} ${booking.service?.service?.price}
                                    </td>
                                    <td className="py-3 px-2">
                                        {booking.addOns?.map((addon: any) => `${addon.subcategoryName} $${addon.subcategoryPrice}`).join(", ") ||
                                            "-"}
                                    </td>
                                    <td className="py-3 px-2 font-medium">${itemTotal}</td>
                                    <td className="py-3 px-2 text-center">
                                        <button
                                            onClick={() => onRemove?.(index)}
                                            className="text-red-500 hover:text-red-700 transition cursor-pointer"
                                            title="Remove"
                                        >
                                            <X size={18} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Summary */}
            <div className="mt-6 text-sm text-gray-600">
                Team Member: {memberName}, ID #{workerId}
            </div>

            <div className="mt-4 text-right text-gray-800 font-medium">
                Total Amount: ${calculateTotal()}
            </div>

            {/* Buttons */}
            <div className="mt-8 flex justify-center gap-6">
                <button
                    onClick={onCheckout}
                    disabled={isLoading}
                    className="bg-primary cursor-pointer text-white px-12 py-3 rounded-lg font-medium hover:bg-pink-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </>
                    ) : (
                        "Check Out"
                    )}
                </button>

                <button
                    onClick={onClear}
                    className="border border-primary text-primary px-12 py-3 rounded-lg font-medium hover:bg-pink-50 transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
