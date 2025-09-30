import { Router } from "express";
import { appConfig } from "../../data/app-config.js";
import { heroContent } from "../../data/hero.js";
import { serviceIcons } from "../../data/icons.js";
import { tileCollections } from "../../data/collections.js";
import {
  products,
  productCategories,
  highlightFilters,
} from "../../data/products.js";
import { brandCatalog } from "../../data/brands.js";
import { articles } from "../../data/articles.js";
import { seoBlock } from "../../data/seo.js";
import { homePage } from "../../data/home.js";
import { footerContent } from "../../data/footer.js";

const router = Router();

router.get("/config", (_req, res) => {
  res.json(appConfig);
});

router.get("/hero", (_req, res) => {
  res.json(heroContent);
});

router.get("/icons", (_req, res) => {
  res.json(serviceIcons);
});

router.get("/collections", (_req, res) => {
  res.json(tileCollections);
});

router.get("/products", (_req, res) => {
  res.json({ items: products, categories: productCategories });
});

router.get("/products/highlights", (_req, res) => {
  res.json(highlightFilters);
});

router.get("/brands", (_req, res) => {
  res.json(brandCatalog);
});

router.get("/articles", (_req, res) => {
  res.json(articles);
});

router.get("/seo", (_req, res) => {
  res.json(seoBlock);
});

router.get("/footer", (_req, res) => {
  res.json(footerContent);
});

router.get("/home", (_req, res) => {
  res.json(homePage);
});

export default router;
