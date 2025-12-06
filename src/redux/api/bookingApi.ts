import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";

const bookingApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getAllUpcomingBookingForWorker: build.query({
            query: () => ({
                url: `/booking/worker-book-slot?filterType=upcoming&status=booked`,
                method: "GET",
            }),
            providesTags: [tagTypes.bookings],
        }),
        getAllBookingsForWorker: build.query({
            query: ({ page, limit, status, filterType }) => {
                console.log({page, limit, status, filterType})
                return {
                    url: `/booking/worker-book-slot?filterType=${filterType}&status=${status || ''}&page=${page}&limit=${limit}`,
                    method: "GET",
                }
            },
            providesTags: [tagTypes.bookings],
        }),

        getAllBookSlotsOneDay: build.query({
            query: (date) => {
                console.log(date, "api date")
                return {
                    url: `/booking/worker-book-slot?date=${date}`,
                    method: "GET",
                }
            },
            providesTags: [tagTypes.bookings],
        }),
    }),
});

export const { useGetAllUpcomingBookingForWorkerQuery, useGetAllBookingsForWorkerQuery, useGetAllBookSlotsOneDayQuery } = bookingApi;
