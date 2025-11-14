import type { Route } from "./+types/Catalog";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { Container } from "@/headerBoard/ui";
import GoodsCard from "@/Home/Goods/GoodsCard";
import Style from "./Catalog.module.scss";
import {
  useGetCatalogGoodsQuery,
  useGetCatalogMetaQuery,
} from "#/apiSlise";
import type { CatalogFilters } from "@/types/goods";

const CATEGORY_LABELS: Record<string, string> = {
  Sinks: "Раковины",
  Baths: "Ванны",
  Toilets: "Унитазы",
  "Shower systems": "Душевые системы",
  Faucets: "Смесители",
  Mirrors: "Зеркала",
  "Shower cabins": "Душевые кабины",
  "Washing machines": "Стиральные машины",
  "Towel dryers": "Полотенцесушители",
  Bidets: "Биде",
  Heaters: "Обогреватели",
  Dishwashers: "Посудомоечные машины",
};

const parseNumberParam = (value: string | null): number | undefined => {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const parseFilters = (params: URLSearchParams): CatalogFilters => {
  const page = parseNumberParam(params.get("page"));
  const limit = parseNumberParam(params.get("limit"));
  const minPrice = parseNumberParam(params.get("minPrice"));
  const maxPrice = parseNumberParam(params.get("maxPrice"));
  const categoriesParam = params.get("categories");
  const search = params.get("search") ?? "";

  const categories = categoriesParam
    ? categoriesParam
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : undefined;

  const saleParam = params.get("sale");
  const hitParam = params.get("hit");

  return {
    page: page && page > 0 ? page : 1,
    limit: limit && limit > 0 ? limit : undefined,
    minPrice,
    maxPrice,
    categories,
    search,
    sale: saleParam === "1" || saleParam === "true",
    hit: hitParam === "1" || hitParam === "true",
  };
};

const numberFromInput = (value: string): number | undefined => {
  if (!value.trim()) return undefined;
  const numeric = Number(value.replace(/\s+/g, ""));
  return Number.isFinite(numeric) ? numeric : undefined;
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Каталог товаров | GG Promarket" },
    {
      name: "description",
      content: "Фильтруйте каталог GG Promarket по цене, категориям и акциям.",
    },
  ];
}

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  const parsedFilters = useMemo(() => parseFilters(searchParams), [searchParams]);
  const queryArgs = useMemo(() => ({
    ...parsedFilters,
    limit: parsedFilters.limit ?? 12,
  }), [parsedFilters]);

  const { data: catalogData, isFetching, isError, error } =
    useGetCatalogGoodsQuery(queryArgs);
  const { data: filtersMeta } = useGetCatalogMetaQuery();

  const [searchValue, setSearchValue] = useState(parsedFilters.search ?? "");
  const [minInput, setMinInput] = useState(
    parsedFilters.minPrice != null ? String(parsedFilters.minPrice) : ""
  );
  const [maxInput, setMaxInput] = useState(
    parsedFilters.maxPrice != null ? String(parsedFilters.maxPrice) : ""
  );

  useEffect(() => {
    setSearchValue(parsedFilters.search ?? "");
  }, [parsedFilters.search]);

  useEffect(() => {
    setMinInput(parsedFilters.minPrice != null ? String(parsedFilters.minPrice) : "");
  }, [parsedFilters.minPrice]);

  useEffect(() => {
    setMaxInput(parsedFilters.maxPrice != null ? String(parsedFilters.maxPrice) : "");
  }, [parsedFilters.maxPrice]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => {
      setIsMobileLayout(window.innerWidth <= 722);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!isMobileLayout) {
      setIsFiltersOpen(false);
    }
  }, [isMobileLayout]);

  const updateParams = useCallback(
    (updates: Record<string, string | number | null | undefined>) => {
      const next = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      });
      setSearchParams(next);
    },
    [searchParams, setSearchParams]
  );

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateParams({ search: searchValue.trim(), page: 1 });
  };

  const handlePriceSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let minValue = numberFromInput(minInput);
    let maxValue = numberFromInput(maxInput);

    if (
      typeof minValue === "number" &&
      typeof maxValue === "number" &&
      minValue > maxValue
    ) {
      [minValue, maxValue] = [maxValue, minValue];
    }

    updateParams({
      minPrice: typeof minValue === "number" ? minValue : null,
      maxPrice: typeof maxValue === "number" ? maxValue : null,
      page: 1,
    });
  };

  const toggleCategory = (category: string) => {
    const current = parsedFilters.categories ?? [];
    const exists = current.includes(category);
    const nextCategories = exists
      ? current.filter((item) => item !== category)
      : [...current, category];
    updateParams({
      categories: nextCategories.length > 0 ? nextCategories.join(",") : null,
      page: 1,
    });
  };

  const toggleFlag = (flag: "sale" | "hit", checked: boolean) => {
    updateParams({ [flag]: checked ? "1" : null, page: 1 });
  };

  const handleReset = () => {
    setSearchParams({});
  };

  const goToPage = (page: number) => {
    if (page <= 0) return;
    updateParams({ page });
  };

  const shouldShowFiltersPanel = !isMobileLayout || isFiltersOpen;

  const items = catalogData?.items ?? [];
  const pagination = catalogData?.pagination;
  const totalPages = pagination?.totalPages ?? 1;
  const currentPage = pagination?.page ?? parsedFilters.page ?? 1;
  const totalItems = pagination?.total ?? items.length;
  const pageSize = pagination?.limit ?? queryArgs.limit ?? 12;
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = totalItems === 0 ? 0 : Math.min(startItem + pageSize - 1, totalItems);

  const activeCategories = parsedFilters.categories ?? [];
  const isSaleActive = Boolean(parsedFilters.sale);
  const isHitActive = Boolean(parsedFilters.hit);

  return (
    <div className={Style.catalogPage}>
      <Container>
        <div className={Style.catalogHeader}>
          <div>
            <p className={Style.catalogEyebrow}>GG Promarket</p>
            <h1 className={Style.catalogTitle}>Каталог товаров</h1>
          </div>
          <div className={Style.catalogStats}>
            {totalItems > 0 ? (
              <span>
                Показано {startItem}-{endItem} из {totalItems}
              </span>
            ) : (
              <span>Товары не найдены</span>
            )}
          </div>
        </div>
        <div className={Style.catalogLayout}>
          {isMobileLayout ? (
            <div className={Style.filtersToggleWrapper}>
              <button
                type="button"
                className={Style.filtersToggleButton}
                onClick={() => setIsFiltersOpen((prev) => !prev)}
                aria-expanded={isFiltersOpen}
              >
                {isFiltersOpen ? "Скрыть фильтры" : "Фильтры"}
              </button>
            </div>
          ) : null}
          {shouldShowFiltersPanel ? (
            <aside
              className={`${Style.filtersPanel} ${
                isFiltersOpen && isMobileLayout ? Style.filtersPanelVisible : ""
              }`}
            >
              <form className={Style.searchForm} onSubmit={handleSearchSubmit}>
                <label htmlFor="catalog-search">Поиск по каталогу</label>
                <div className={Style.searchControl}>
                  <input
                    id="catalog-search"
                    type="text"
                    placeholder="Введите название товара"
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                  />
                  <button type="submit">Найти</button>
                </div>
              </form>

              <form className={Style.priceForm} onSubmit={handlePriceSubmit}>
                <div className={Style.sectionHeader}>Цена, ₽</div>
                <span className={Style.priceFormLabel}>от — до</span>
                <div className={Style.priceInputs}>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9\s]*"
                    placeholder={`от ${filtersMeta?.priceRange.min ?? "0"}`}
                    value={minInput}
                    onChange={(event) => setMinInput(event.target.value)}
                  />
                  <span className={Style.priceDivider}>—</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9\s]*"
                    placeholder={`до ${filtersMeta?.priceRange.max ?? "0"}`}
                    value={maxInput}
                    onChange={(event) => setMaxInput(event.target.value)}
                  />
                </div>
                <button type="submit" className={Style.applyButton}>
                  Применить
                </button>
              </form>

              <div className={Style.section}>
                <div className={Style.sectionHeader}>Категории</div>
                <div className={Style.categoriesList}>
                  {(filtersMeta?.categories ?? []).map((category) => (
                    <label key={category} className={Style.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={activeCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                      />
                      <span>{CATEGORY_LABELS[category] ?? category}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className={Style.section}>
                <div className={Style.sectionHeader}>Спецпредложения</div>
                <label className={Style.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={isSaleActive}
                    onChange={(event) => toggleFlag("sale", event.target.checked)}
                  />
                  <span>Показывать акции</span>
                </label>
                <label className={Style.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={isHitActive}
                    onChange={(event) => toggleFlag("hit", event.target.checked)}
                  />
                  <span>Хиты продаж</span>
                </label>
              </div>

              <button
                type="button"
                className={Style.resetButton}
                onClick={handleReset}
              >
                Сбросить фильтры
              </button>
            </aside>
          ) : null}
          <section className={Style.resultsPanel}>
            {isFetching ? (
              <div className={Style.stateBanner}>Загружаем подборку…</div>
            ) : null}
            {isError ? (
              <div className={Style.stateBanner}>
                Не удалось загрузить каталог: {JSON.stringify(error)}
              </div>
            ) : null}

            {!isFetching && !isError && items.length === 0 ? (
              <div className={Style.stateBanner}>По выбранным фильтрам ничего не найдено.</div>
            ) : null}

            <div className={Style.cardsGrid}>
              {items.map((item) => (
                <GoodsCard key={item.id} item={item} />
              ))}
            </div>

            {totalPages > 1 ? (
              <Pagination
                current={currentPage}
                total={totalPages}
                onChange={goToPage}
              />
            ) : null}
          </section>
        </div>
      </Container>
    </div>
  );
}

type PaginationProps = {
  current: number;
  total: number;
  onChange: (page: number) => void;
};

function Pagination({ current, total, onChange }: PaginationProps) {
  const createPageRange = () => {
    const maxButtons = 5;
    let start = Math.max(1, current - 2);
    let end = Math.min(total, start + maxButtons - 1);

    if (end - start < maxButtons - 1) {
      start = Math.max(1, end - maxButtons + 1);
    }

    const pages: number[] = [];
    for (let page = start; page <= end; page++) {
      pages.push(page);
    }
    return pages;
  };

  const pages = createPageRange();

  return (
    <div className={Style.pagination}>
      <button
        type="button"
        onClick={() => onChange(current - 1)}
        disabled={current <= 1}
      >
        Назад
      </button>
      {pages[0] > 1 ? (
        <button type="button" onClick={() => onChange(1)}>
          1
        </button>
      ) : null}
      {pages[0] > 2 ? <span className={Style.paginationDots}>…</span> : null}
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onChange(page)}
          className={page === current ? Style.paginationActive : undefined}
        >
          {page}
        </button>
      ))}
      {pages[pages.length - 1] < total - 1 ? (
        <span className={Style.paginationDots}>…</span>
      ) : null}
      {pages[pages.length - 1] < total ? (
        <button type="button" onClick={() => onChange(total)}>
          {total}
        </button>
      ) : null}
      <button
        type="button"
        onClick={() => onChange(current + 1)}
        disabled={current >= total}
      >
        Вперёд
      </button>
    </div>
  );
}
