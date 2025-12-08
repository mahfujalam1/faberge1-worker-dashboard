import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";

const workerApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getAllWorkers: build.query({
            query: () => ({
                url: `/worker/get-all-worker?isBlocked=false`,
                method: "GET",
            }),
            providesTags: [tagTypes.workers],
        }),
        getSingleworker: build.query({
            query: (workerId) => ({
                url: `/worker/get-one-worker/${workerId}`,
                method: "GET",
            }),
            providesTags: [tagTypes.workers],
        }),
        // contactUs: build.mutation({
        //     query: (data) => {
        //         return {
        //             url: `/public/create-contact-us`,
        //             method: "POST",
        //             body: data,
        //         }
        //     },
        //     invalidatesTags: [tagTypes.siteContent],
        // }),
    }),
});

export const { useGetAllWorkersQuery, useGetSingleworkerQuery } = workerApi;
