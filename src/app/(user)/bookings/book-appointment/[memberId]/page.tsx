"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import { GridLoader } from "react-spinners";
import {
    BookingItem,
    SelectedSlot,
    Service,
} from "@/types/booking/appointment";
import BookingCart from "@/components/BookingsComponents/booking-cart";
import CalendarComponent from "@/components/BookingsComponents/calendar-component";
import ServiceSelectionTable from "@/components/BookingsComponents/service-selection";
import { IMAGES } from "@/constants/image.index";
import { useGetSingleworkerQuery } from "@/redux/api/workerApi";
import { useGetAvailableSlotQuery, useGetCalenderScheduleQuery } from "@/redux/api/calenderApi";
import { toast } from "sonner";
import { useBookSlotMutation, usePaymentForSlotMutation } from "@/redux/api/bookingApi";

export default function BookAppointmentPage({
    params,
}: {
    params: Promise<{ memberId: string }>;
}) {
    const { memberId } = React.use(params);
    const [bookSlot] = useBookSlotMutation()
    const [isLoading, setIsLoading] = useState(false)
    const [mounted, setMounted] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState<number>(0);
    const [selectedYear, setSelectedYear] = useState<number>(2024);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedSlots, setSelectedSlots] = useState<SelectedSlot[]>([]);
    const [bookings, setBookings] = useState<BookingItem[]>([]);

    const [slotPayment] = usePaymentForSlotMutation()
    const { data } = useGetSingleworkerQuery(memberId);
    const member = data?.data;

    const { data: slots } = useGetAvailableSlotQuery({
        workerId: memberId,
        date: selectedDate || ""
    });
    const availableSlots = slots?.data || null;

    const { data: calender } = useGetCalenderScheduleQuery({
        workerId: memberId,
        year: selectedYear,
        month: selectedMonth + 1
    });
    const calenderData = calender?.data || [];

    // ✅ Set current date after mount
    useEffect(() => {
        const now = new Date();
        setSelectedMonth(now.getMonth());
        setSelectedYear(now.getFullYear());
        setMounted(true);
    }, []);

    const handleSlotChange = (
        slot: SelectedSlot | null,
        time: string,
        service: any
    ) => {
        if (slot) {
            setSelectedSlots([...selectedSlots, slot]);
        } else {
            setSelectedSlots(
                selectedSlots.filter(
                    (s) => !(s.time === time && s.service?._id === service?.service?._id)
                )
            );
        }
    };

    const handleAddOnToggle = (
        time: string,
        service: any,
        addOn: any
    ) => {
        setSelectedSlots(
            selectedSlots.map((slot: any) => {
                // Match both time AND the specific service's _id
                if (slot.time === time && slot.service?.service?._id === service?.service?._id) {
                    const hasAddOn = slot.addOns.some((a: any) => a._id === addOn._id);
                    return {
                        ...slot,
                        addOns: hasAddOn
                            ? slot.addOns.filter((a: any) => a._id !== addOn._id)
                            : [...slot.addOns, addOn],
                    };
                }
                return slot;
            })
        );
    };

    const handleAddBookings = () => {
        if (!selectedDate || selectedSlots.length === 0) {
            alert("Please select a date and at least one service");
            return;
        }

        const newBookings: BookingItem[] = selectedSlots.map((slot) => ({
            date: selectedDate,
            time: slot.time,
            service: slot.service,
            addOns: slot.addOns,
        }));

        setBookings((prev) => [...prev, ...newBookings]);
        setSelectedSlots([]);
        setSelectedDate(null);
    };

    const handleRemoveBooking = (index: number) => {
        setBookings((prev) => prev.filter((_, i) => i !== index));
    };

    const handleClearBookings = () => {
        setBookings([]);
    };

    const handleCheckout = async () => {
        if (bookings.length === 0) {
            toast.error("No bookings to checkout");
            return;
        }

        // Group bookings by date and time
        const groupedBookings = bookings.reduce((acc: any, booking: any) => {
            const key = `${booking.date}-${booking.time}`;

            if (!acc[key]) {
                acc[key] = {
                    date: booking.date,
                    startTime: booking.time.split(' - ')[0],
                    services: []
                };
            }

            // Add service with its subcategories (addOns)
            acc[key].services.push({
                serviceId: booking.service?.service?._id, // ✅ Fixed
                serviceCategories: booking.addOns.map((addon: any) => addon._id)
            });

            return acc;
        }, {});

        // Convert grouped bookings to array
        const bookingRequests = Object.values(groupedBookings).map((group: any) => ({
            workerId: memberId,
            services: group.services,
            date: group.date,
            startTime: group.startTime
        }));

        try {
            for (const bookingData of bookingRequests) {
                setIsLoading(true)
                const res = await bookSlot(bookingData);
                if (res?.error) {
                    toast.error((res?.error as any)?.data?.message);
                    setIsLoading(false)
                } else if (res?.data) {
                    const paymentRes = await slotPayment({ bookingId: res?.data?.data?._id })
                    console.log(paymentRes)
                    if (paymentRes?.data) {
                        const paymentUrl = paymentRes?.data?.url;
                        console.log(paymentUrl)
                        if (paymentUrl) {
                            window.location.href = paymentUrl;
                        }
                        setIsLoading(false)
                    } else if (paymentRes?.error) {
                        toast.error((paymentRes?.error as any)?.data?.message);
                        setIsLoading(false)
                    }
                }

                console.log(res)
            }

            setBookings([]);
            // router.push(`/bookings/success`);
        } catch (error) {
            console.error("Booking error:", error);
            toast.error("Failed to book appointments. Please try again.");
        }
    };

    // ✅ Show loader until mounted
    if (!member || !mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <GridLoader color="#ff69b4" size={15} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-tl from-[#fdeaea] via-[#fff1f3] to-[#ffdae1] p-4">
            <h1 className="text-2xl font-semibold text-center pb-5 text-primary">
                SCHEDULE BOOKINGS
            </h1>
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-5 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-5">
                        <div className="flex flex-col items-center justify-center p-2 bg-gray-50/50 rounded-lg shadow-md md:h-[300px] ms-5">
                            <div className="shadow-lg bg-white p-3 rounded-lg">
                                <div className="lg:w-40 w-24 h-20 md:w-32 lg:h-40 md:h-32 rounded-lg overflow-hidden mb-4">
                                    <Image
                                        src={
                                            member?.uploadPhoto === "http://10.10.20.16:5137undefined"
                                                ? IMAGES?.workerProfile.src
                                                : member?.uploadPhoto
                                        }
                                        alt={member.firstName}
                                        width={200}
                                        height={200}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-center text-sm md:text-md">
                                        {member?.firstName} {member?.lastName}
                                    </h3>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-1 text-xs text-gray-600 mb-1">
                                        <span>
                                            {member?.city}, {member?.state}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-700">{member?.title}</div>
                                    <div className="flex items-end justify-center gap-1 text-xs text-gray-700">
                                        <span>ID#:</span>
                                        <span>{member?.workerId}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden">
                            <CalendarComponent
                                calenderData={calenderData}
                                selectedMonth={selectedMonth}
                                selectedYear={selectedYear}
                                onMonthChange={setSelectedMonth}
                                onYearChange={setSelectedYear}
                                setSelectedDate={setSelectedDate}
                                availableSlots={availableSlots}
                            />

                            {selectedDate && availableSlots && (
                                <div>
                                    <div className="mt-6 space-y-4 md:-w-60 h-72 overflow-y-auto border-b rounded-b-lg">
                                        <ServiceSelectionTable
                                            workerId={memberId}
                                            slots={availableSlots.slots || []}
                                            services={member.services || []}
                                            extraServices={member.subservices || []}
                                            selectedSlots={selectedSlots}
                                            onSlotChange={handleSlotChange}
                                            onAddOnToggle={handleAddOnToggle}
                                        />
                                    </div>
                                    <div className="flex gap-4 justify-between me-3 mt-5">
                                        <button
                                            onClick={handleAddBookings}
                                            disabled={selectedSlots.length === 0}
                                            className="w-34 bg-primary cursor-pointer text-white py-3 rounded-lg font-medium hover:bg-pink-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                        >
                                            Add
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedDate(null);
                                                setSelectedSlots([]);
                                            }}
                                            className="w-34 bg-white cursor-pointer text-gray-700 py-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <BookingCart
                    isLoading={isLoading}
                    bookings={bookings}
                    memberName={member.name}
                    workerId={member.workerId}
                    onCheckout={handleCheckout}
                    onRemove={handleRemoveBooking}
                    onClear={handleClearBookings}
                />
            </div>
        </div>
    );
}