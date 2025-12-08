import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";

const publicApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getAllDynamicBanner: build.query({
            query: () => ({
                url: `/photo/get-all-dynamic-photo`,
                method: "GET",
            }),
            providesTags: [tagTypes.siteContent],
        }),
        getAboutUs: build.query({
            query: () => ({
                url: `/public/get-about-us`,
                method: "GET",
            }),
            providesTags: [tagTypes.siteContent],
        }),
        contactUs: build.mutation({
            query: (data) => {
                return {
                    url: `/public/create-contact-us`,
                    method: "POST",
                    body: data,
                }
            },
            invalidatesTags: [tagTypes.siteContent],
        }),
    }),
});

export const { useGetAllDynamicBannerQuery, useGetAboutUsQuery, useContactUsMutation } = publicApi;
