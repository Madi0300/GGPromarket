import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { CatalogFilters, GoodsItem } from "@/types/goods";

export type CatalogResponse = {
  items: GoodsItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type CatalogMeta = {
  categories: string[];
  priceRange: {
    min: number;
    max: number;
  };
};

const buildCatalogQueryParams = (filters?: CatalogFilters) => {
  const params: Record<string, string | number> = {};

  if (!filters) {
    return params;
  }

  if (filters.page && filters.page > 1) {
    params.page = filters.page;
  }

  if (filters.limit && filters.limit !== 12) {
    params.limit = filters.limit;
  }

  if (filters.search?.trim()) {
    params.search = filters.search.trim();
  }

  if (filters.categories && filters.categories.length > 0) {
    params.categories = filters.categories.join(",");
  }

  if (typeof filters.minPrice === "number") {
    params.minPrice = filters.minPrice;
  }

  if (typeof filters.maxPrice === "number") {
    params.maxPrice = filters.maxPrice;
  }

  if (filters.sale) {
    params.sale = "1";
  }

  if (filters.hit) {
    params.hit = "1";
  }

  return params;
};

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
    getCatalogMeta: builder.query<CatalogMeta, void>({
      query: () => "/catalog/meta",
    }),
    getCatalogGoods: builder.query<CatalogResponse, CatalogFilters | undefined>({
      query: (filters) => ({
        url: "/catalog/goods",
        params: buildCatalogQueryParams(filters),
      }),
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
  useGetCatalogMetaQuery,
  useGetCatalogGoodsQuery,
} = apiSlice;
