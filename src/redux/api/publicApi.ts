import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";

const publicApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getAllDynamicBanner: build.query({
            query: () => ({
                url: `photo/get-all-dynamic-photo`,
                method: "GET",
            }),
            providesTags: [tagTypes.siteContent],
        }),
    }),
});

export const { useGetAllDynamicBannerQuery } = publicApi;
