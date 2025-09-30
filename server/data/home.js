import { heroContent } from "./hero.js";
import { serviceIcons } from "./icons.js";
import { tileCollections } from "./collections.js";
import { products, productCategories, highlightFilters } from "./products.js";
import { brandCatalog } from "./brands.js";
import { articles } from "./articles.js";
import { seoBlock } from "./seo.js";

export const homePage = {
  hero: heroContent,
  icons: serviceIcons,
  collections: tileCollections,
  products: {
    items: products,
    categories: productCategories,
    highlights: highlightFilters,
  },
  brands: brandCatalog,
  articles,
  seo: seoBlock,
};
