import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";

const stateApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getAllState: build.query({
            query: () => ({
                url: `/state/get-all-state`,
                method: "GET",
            }),
            providesTags: [tagTypes?.states],
        }),
    }),
});

export const { useGetAllStateQuery } = stateApi;
