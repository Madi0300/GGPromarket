export type GoodsCategory =
  | "Sinks"
  | "Baths"
  | "Toilets"
  | "Shower systems"
  | "Faucets"
  | "Mirrors"
  | "Shower cabins"
  | "Washing machines"
  | "Towel dryers"
  | "Bidets"
  | "Heaters"
  | "Dishwashers";

export type GoodsItem = {
  id: number;
  name: string;
  href: string;
  country: string;
  price: number;
  discount: number | null;
  imgUrl: string;
  rate: number;
  commentsSum: number;
  isHit?: boolean;
  category: GoodsCategory;
  description?: string;
};

export type CatalogFilters = {
  page?: number;
  limit?: number;
  search?: string;
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  sale?: boolean;
  hit?: boolean;
};
