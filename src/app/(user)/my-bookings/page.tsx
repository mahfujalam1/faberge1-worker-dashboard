"use client";

import { BookingCard } from "@/components/myBookings/BookingCard";
import { BookingTabs } from "@/components/myBookings/BookingTabs";
import { Button } from "@/components/ui/button";
import { WorkerBookingCard } from "@/components/workerBookings/WorkerBookingCard";
import { WorkerBookingTab } from "@/components/workerBookings/WorkerBookingTab";
import { useGetAllBookingsForCustomerQuery } from "@/redux/api/bookingApi";
import { useState } from "react";

export default function AllBookings() {
    const [tab, setTab] = useState<"" | "booked" | "completed">("");
    const [filterType, setFilterType] = useState<"" | "upcoming" | "completed">("");



    const [currentPage, setCurrentPage] = useState(1);
    const limit = 4;

    const { data, isLoading, error } = useGetAllBookingsForCustomerQuery({
        page: currentPage,
        limit: limit,
        status: tab === "" ? undefined : tab,
        filterType: filterType === "" ? undefined : filterType,
    });
    console.log(data)

    // Flatten the bookings from the grouped date structure
    const bookings = data?.data
        ? Object.values(data.data).flat()
        : [];

    console.log(bookings)

    const pagination = data?.pagination;

    const filteredBookings = bookings.filter((b: any) =>
        tab === "" ? true : b.status === tab
    );

    console.log('Upcoming Bookings:', bookings);
    console.log('Pagination:', pagination);

    // Pagination handlers
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (bookings?.length === limit || currentPage < (pagination?.totalPages || 1)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const renderPageButtons = () => {
        let buttons = [];
        for (let i = 1; i <= (pagination?.totalPages || 1); i++) {
            buttons.push(
                <Button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`${currentPage === i
                        ? "bg-pink-500 text-white hover:bg-pink-600"
                        : "bg-white text-pink-500 border border-pink-500 hover:bg-pink-50"
                        }`}
                >
                    {i}
                </Button>
            );
        }
        return buttons;
    };


    return (
        <div>
            {/* <DynamicBanner title="My Bookings" /> */}
            <div className="min-h-screen bg-gradient-to-tr from-[#fdeaea] via-[#fff1f3] to-[#ffdae1] p-4 md:py-5">
                <div className="container mx-auto">
                    <div className="p-8 bg-white">
                        <BookingTabs setTab={setTab} tab={tab} filteredBookings={filteredBookings} setFilterType={setFilterType} />
                        {isLoading ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500">Loading bookings...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-8">
                                <p className="text-red-500">Error loading bookings. Please try again.</p>
                            </div>
                        ) : filteredBookings.length > 0 ? (
                            <>
                                {filteredBookings?.map((booking: any) => (
                                    <BookingCard key={booking._id} booking={booking} />
                                ))}

                                {/* Pagination */}
                                <div className="flex justify-center items-center space-x-4 py-4">
                                    <Button
                                        onClick={handlePreviousPage}
                                        disabled={currentPage === 1}
                                        className="bg-pink-500 text-white hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </Button>

                                    {/* Dynamic page number buttons */}
                                    <div className="flex space-x-2">{renderPageButtons()}</div>

                                    <Button
                                        onClick={handleNextPage}
                                        disabled={currentPage === pagination?.totalPages}
                                        className="bg-pink-500 text-white hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <p className="text-gray-500 text-center py-8">No upcoming bookings found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
