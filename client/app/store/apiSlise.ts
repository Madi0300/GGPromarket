import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3001/api" }),

  endpoints: (builder) => ({
    getHeroData: builder.query({
      query: () => "/hero",
    }),
    getHeaderData: builder.query({
      query: () => "/header",
    }),
    getCollectionsData: builder.query({
      query: () => "/collections",
    }),
  }),
});

export const {
  useGetHeroDataQuery,
  useGetHeaderDataQuery,
  useGetCollectionsDataQuery,
} = apiSlice;
