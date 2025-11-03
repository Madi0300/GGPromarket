import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_BASE_URL }),

  endpoints: (builder) => ({
    getServerUrl: builder.query({
      query: () => "/server-url",
    }),
    getHeaderData: builder.query({
      query: () => "/header",
    }),
    getCollectionsData: builder.query({
      query: () => "/collections",
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
    getFooterData: builder.query({
      query: () => "/footer",
    }),
    getGoodDataById: builder.query({
      query: (id) => `/goods/${id}`,
    }),
  }),
});

export const {
  useGetServerUrlQuery,
  useGetHeaderDataQuery,
  useGetCollectionsDataQuery,
  useGetGoodsDataQuery,
  useGetBrandsDataQuery,
  useGetArticlesDataQuery,
  useGetSEODataQuery,
  useGetFooterDataQuery,
  useGetGoodDataByIdQuery,
} = apiSlice;
