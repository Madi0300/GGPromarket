import Style from "./Goods.module.scss";
import { useState, useEffect, useRef, type ReactNode } from "react";
import { useNavigate } from "react-router";
import { Title } from "../home";
import { useGetGoodsDataQuery } from "#/apiSlise";
import { Rate } from "@/headerBoard/ui";
import { useAppDispatch } from "#/hooks";
import { increment } from "#/clientStates";

type Category =
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

type GoodsSliderSign = "hit" | "discount";

type GoodsItem = {
  name: string;
  href: string;
  country: string;
  price: number;
  discount?: number | null;
  imgUrl: string;
  rate: number;
  commentsSum: number;
  isHit?: boolean;
  category: Category;
  id: number;
};

type FilterCategory = Category | "All";

type GoodsProps = {
  data?: GoodsItem[];
  categoriesList?: CategoriesListData;
  sliderSigns?: GoodsSliderSign[];
};

type CategoryItem = {
  tag: Category;
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
  const { isSuccess, isError, error, data } = useGetGoodsDataQuery(null);
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
        {isError ? JSON.stringify(itemError) : null}
        <Title description="Акции" />
        {isSuccess ? (
          <GoodsSlider
            categories={categoriesList.discounts}
            data={itemData}
            sign={signs[1]}
          />
        ) : null}
        {isError ? JSON.stringify(itemError) : null}
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
          <div
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
          </div>
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
        <div className={Style.GoodsSlider__items}>
          <div ref={scrollEl} className={Style.GoodsSlider__items__wrapper}>
            {items.map((item) => (
              <GoodsItemCard key={item.name} props={item} scrollEl={scrollEl} />
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
      </div>
    </>
  );
}

type GoodsItemProps = {
  props: GoodsItem;
  scrollEl: React.RefObject<HTMLDivElement | null>;
};

function GoodsItemCard({ props, scrollEl }: GoodsItemProps) {
  const [isDefaultImg, setIsDefaultImg] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const elem = useRef<HTMLAnchorElement | null>(null);

  const navigate = useNavigate();

  const price = props.price
    .toString()
    .split("")
    .reverse()
    .map((item, index) => {
      if ((index + 1) % 3 === 0 && index !== 0) return " " + item;
      else return item;
    })
    .reverse()
    .join("");

  const discount = props.discount
    ? props.discount
        .toString()
        .split("")
        .reverse()
        .map((item, index) => {
          if ((index + 1) % 3 === 0 && index !== 0) return " " + item;
          else return item;
        })
        .reverse()
        .join("")
    : null;

  const isDiscount =
    props.discount != null &&
    Number.isFinite(props.discount) &&
    props.price > 0;

  const discountItem = (
    <p className={Style.GoodsItem__discount}>
      {discount != null && discount > price ? discount : price + " ₽"}
    </p>
  );
  const nullItem = <div className={Style.GoodsItem__nullItem}></div>;
  const discountSign = (
    <div className={Style.GoodsItem__discountSign}>АКЦИЯ</div>
  );
  const hitSign = <div className={Style.GoodsItem__hitSign}>ХИТ</div>;

  const goodItemSigns = (
    <div className={Style.GoodsItem__signs}>
      {props.isHit ? hitSign : null}
      {isDiscount ? discountSign : null}
    </div>
  );

  useEffect(() => {
    if (!elem.current) return;
    if (isVisible) return;
    const element = elem.current;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      {
        root: scrollEl.current,
        rootMargin: "300px",
        threshold: 0.1,
      }
    );
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [isVisible, scrollEl]);

  const likeElem = useRef<HTMLImageElement | null>(null);

  const localLikes = JSON.parse(localStorage.getItem("likes") || "[]");

  const [isLiked, setIsLiked] = useState(localLikes.includes(props.id));
  const dispatch = useAppDispatch();

  function handleClickCard(e: React.MouseEvent, id: number) {
    if (likeElem.current && e.target === likeElem.current) {
      console.log("like");
      const localLikesJSON = localStorage.getItem("likes");
      const localLikes = localLikesJSON ? JSON.parse(localLikesJSON) : [];

      console.log(localLikes);

      if (localLikes.includes(id)) {
        const newLikes = localLikes.filter((item: number) => item !== id);
        console.log(newLikes);
        localStorage.setItem("likes", JSON.stringify(newLikes));
        setIsLiked(false);
      } else {
        localLikes.push(id);
        localStorage.setItem("likes", JSON.stringify(localLikes));
        setIsLiked(true);
      }
      dispatch(increment());
    } else {
      navigate(`/product/${id}`, { preventScrollReset: true });
    }
  }

  return (
    <a
      ref={elem}
      href={props.href}
      onMouseLeave={() => {
        setIsHover(false);
      }}
      onMouseEnter={() => {
        setIsHover(true);
      }}
      onClick={(e) => {
        e.preventDefault();
        handleClickCard(e, props.id);
      }}
      className={Style.GoodsItem + " " + (isHover ? Style.active : "")}
    >
      {isVisible ? (
        <img
          className={Style.GoodsItem__image}
          src={
            !isDefaultImg
              ? props.imgUrl
              : `${import.meta.env.BASE_URL}Goods/default.png`
          }
          alt=""
          onError={() => {
            setIsDefaultImg(true);
          }}
        />
      ) : null}
      <div className={Style.GoodsItem__content}>
        <Rate rateSum={props.rate} commentsSum={props.commentsSum} />
        <h4 className={Style.GoodsItem__title}>{props.name}</h4>
        <p className={Style.GoodsItem__country}>{props.country}</p>
        <div className={Style.GoodsItem__info}>
          <p className={Style.GoodsItem__price}>
            {discount != null && discount < price ? discount : price + " ₽"}
          </p>
          <button className={Style.GoodsItem__button}>В корзину</button>
          {Number.isFinite(props.discount) ? discountItem : nullItem}
        </div>
      </div>
      <div className={Style.GoodsItem__hoverBanner}>Быстрый просмотр</div>
      <img
        ref={likeElem}
        src={
          isLiked
            ? `${import.meta.env.BASE_URL}Goods/liked.png`
            : `${import.meta.env.BASE_URL}Goods/like.svg`
        }
        alt="like"
        className={Style.GoodsItem__like}
      />
      {isDiscount || props.isHit ? goodItemSigns : null}
    </a>
  );
}
