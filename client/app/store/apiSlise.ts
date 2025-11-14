import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_BASE_URL }),

  endpoints: (builder) => ({
    getServerUrl: builder.query({
      query: () => "/server-url",
    }),
    getGoodsData: builder.query({
      query: () => "/goods",
    }),
    getBrandsData: builder.query({
      query: () => "/brands",
    }),
    getArticlesData: builder.query({
      query: () => "/articles",
    }),
    getSEOData: builder.query({
      query: () => "/seo",
    }),
    getGoodDataById: builder.query({
      query: (id) => `/goods/${id}`,
    }),
  }),
});

export const {
  useGetServerUrlQuery,
  useGetGoodsDataQuery,
  useGetBrandsDataQuery,
  useGetArticlesDataQuery,
  useGetSEODataQuery,
  useGetGoodDataByIdQuery,
} = apiSlice;
