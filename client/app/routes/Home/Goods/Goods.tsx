import Style from "./Goods.module.scss";
import { useState, useRef, type ReactNode } from "react";
import { Title } from "../home";
import { useGetGoodsDataQuery } from "#/apiSlise";
import GoodsCard from "./GoodsCard";
import type { GoodsCategory, GoodsItem } from "@/types/goods";

type GoodsSliderSign = "hit" | "discount";

type FilterCategory = GoodsCategory | "All";

type CategoryItem = {
  tag: GoodsCategory;
  text: string;
};

type CategoriesListData = {
  hits: CategoryItem[];
  discounts: CategoryItem[];
};

const dataCategories: CategoriesListData = {
  hits: [
    { tag: "Sinks", text: "Раковины" },
    { tag: "Baths", text: "Ванны" },
    { tag: "Toilets", text: "Унитазы" },
    { tag: "Shower systems", text: "Душевые системы" },
    { tag: "Faucets", text: "Смесители" },
    { tag: "Mirrors", text: "Зеркала" },
    { tag: "Shower cabins", text: "Душевые кабины" },
    { tag: "Washing machines", text: "Стиральные машины" },
  ],
  discounts: [
    { tag: "Faucets", text: "Смесители" },
    { tag: "Towel dryers", text: "Полотенцесушители" },
    { tag: "Bidets", text: "Биде" },
    { tag: "Shower systems", text: "Душевые системы" },
    { tag: "Baths", text: "Ванны" },
    { tag: "Toilets", text: "Унитазы" },
    { tag: "Heaters", text: "Обогреватели" },
    { tag: "Dishwashers", text: "Посудомоечные машины" },
  ],
} as const;

const signs: GoodsSliderSign[] = ["hit", "discount"];

export default function Goods() {
  const { isSuccess, isError, error, data, isLoading } =
    useGetGoodsDataQuery(null);
  const itemData = isSuccess ? data : "loading";
  const itemError = isError ? error : null;
  const categoriesList = dataCategories;

  return (
    <>
      <Title description="Хиты продаж" />
      <div className={Style.Goods}>
        {isSuccess ? (
          <GoodsSlider
            categories={categoriesList.hits}
            data={itemData}
            sign={signs[0]}
          />
        ) : null}
        {isLoading ? (
          <div className={Style.Goods__loading}>Загрузка...</div>
        ) : null}
        {isError ? (
          <div className={Style.Goods__error}>{JSON.stringify(error)}</div>
        ) : null}

        <Title description="Акции" />
        {isSuccess ? (
          <GoodsSlider
            categories={categoriesList.discounts}
            data={itemData}
            sign={signs[1]}
          />
        ) : null}
        {isLoading ? (
          <div className={Style.Goods__loading}>Загрузка...</div>
        ) : null}
        {isError ? (
          <div className={Style.Goods__error}>{JSON.stringify(error)}</div>
        ) : null}
      </div>
    </>
  );
}

type GoodsSliderProps = {
  data: GoodsItem[];
  categories: CategoryItem[];
  sign: GoodsSliderSign;
};

function GoodsSlider({ data, categories, sign }: GoodsSliderProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<FilterCategory>("All");
  const items = data.filter((item) => {
    if (sign === "hit" && item.isHit) {
      if (selectedCategory === "All") return true;
      if (item.category === selectedCategory) return true;
      return false;
    }

    if (
      sign === "discount" &&
      item.discount != null &&
      item.price >= item.discount
    ) {
      if (selectedCategory === "All") return true;
      if (item.category === selectedCategory) return true;
      return false;
    }

    return false;
  });

  const scrollEl = useRef<HTMLDivElement | null>(null);

  function scrollBy(direction: "left" | "right", el: HTMLElement | null) {
    if (!el) return;
    if (direction === "right") {
      el.scrollBy({
        left: 308,
        behavior: "smooth",
      });
    }
    if (direction === "left") {
      el.scrollBy({
        left: -308,
        behavior: "smooth",
      });
    }
  }

  return (
    <>
      <div className={Style.GoodsSlider}>
        <div className={Style.GoodsSlider__categories}>
          <button
            onClick={() => {
              setSelectedCategory("All");
            }}
            className={
              Style.GoodsSlider__category +
              " " +
              (selectedCategory === "All" ? Style.selected : "")
            }
          >
            Любые товары
          </button>
          {categories.map((item) => {
            return (
              <div
                onClick={() => {
                  setSelectedCategory(item.tag);
                }}
                key={item.tag}
                className={
                  Style.GoodsSlider__category +
                  " " +
                  (selectedCategory === item.tag ? Style.selected : "")
                }
              >
                {item.text}
              </div>
            );
          })}
        </div>
        {items.length > 0 ? (
          <div className={Style.GoodsSlider__items}>
            <div ref={scrollEl} className={Style.GoodsSlider__items__wrapper}>
              {items.map((item) => (
                <GoodsCard
                  key={item.id}
                  item={item}
                  scrollContainer={scrollEl}
                />
              ))}
            </div>
            <div className={Style.GoodsSlider__items__buttons}>
              <button
                onClick={() =>
                  scrollBy("left", scrollEl.current as HTMLElement | null)
                }
                className={Style.GoodsSlider__items__buttonLeft}
              >
                <img
                  className={Style.GoodsSlider__items__button__img}
                  src={`${import.meta.env.BASE_URL}Goods/arrow.svg`}
                  alt="arrow"
                />
              </button>
              <button
                onClick={() =>
                  scrollBy("right", scrollEl.current as HTMLElement | null)
                }
                className={Style.GoodsSlider__items__buttonRight}
              >
                <img
                  className={Style.GoodsSlider__items__button__img}
                  src={`${import.meta.env.BASE_URL}Goods/arrow.svg`}
                  alt="arrow"
                />
              </button>
            </div>
          </div>
        ) : (
          <div className={Style.GoodsSlider__noItems}>Товары не найдены</div>
        )}
      </div>
    </>
  );
}

