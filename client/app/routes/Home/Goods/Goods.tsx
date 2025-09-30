import Style from "./Goods.module.scss";
import {
  useState,
  useEffect,
  useRef,
  useMemo,
  type RefObject,
} from "react";
import { Title } from "../home";
import type {
  Product,
  ProductCategory,
  HighlightFilters,
} from "../../../api/types";

type CategoryItem = {
  tag: string;
  text: string;
};

type GoodsProps = {
  items?: Product[];
  categories?: ProductCategory[];
  highlights?: HighlightFilters;
};

type GoodsSliderProps = {
  data: Product[];
  categories: CategoryItem[];
  mode: "hit" | "discount";
};

const ALL_CATEGORY = "all";
const currencyFormatter = new Intl.NumberFormat("ru-RU");

export default function Goods({
  items = [],
  categories = [],
  highlights,
}: GoodsProps) {
  const categoriesMap = useMemo(
    () => new Map(categories.map((item) => [item.id, item])),
    [categories]
  );

  const hitsCategories = useMemo(
    () =>
      createCategoryItems(highlights?.hits ?? [], categoriesMap),
    [highlights?.hits, categoriesMap]
  );

  const discountCategories = useMemo(
    () =>
      createCategoryItems(highlights?.discounts ?? [], categoriesMap),
    [highlights?.discounts, categoriesMap]
  );

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <Title description="Хиты продаж" />
      <div className={Style.Goods}>
        <GoodsSlider categories={hitsCategories} data={items} mode="hit" />
        <Title description="Акции" />
        <GoodsSlider
          categories={discountCategories}
          data={items}
          mode="discount"
        />
      </div>
    </>
  );
}

function GoodsSlider({ data, categories, mode }: GoodsSliderProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(ALL_CATEGORY);
  const scrollEl = useRef<HTMLDivElement | null>(null);

  const filteredItems = useMemo(() => {
    return data.filter((item) => {
      const matchesMode =
        mode === "hit"
          ? item.availability.isHit
          : item.availability.hasDiscount;

      if (!matchesMode) return false;
      if (selectedCategory === ALL_CATEGORY) return true;
      return item.categories.includes(selectedCategory);
    });
  }, [data, mode, selectedCategory]);

  function scrollBy(direction: "left" | "right") {
    const el = scrollEl.current;
    if (!el) return;

    const card = el.querySelector(
      `.${Style.GoodsItem}`
    ) as HTMLElement | null;
    const gap = 20;
    const defaultCardWidth = 288;
    const cardWidth = card ? card.offsetWidth : defaultCardWidth;

    el.scrollBy({
      left: direction === "right" ? cardWidth + gap : -(cardWidth + gap),
      behavior: "smooth",
    });
  }

  return (
    <div className={Style.GoodsSlider}>
      <div className={Style.GoodsSlider__categories}>
        <div
          onClick={() => {
            setSelectedCategory(ALL_CATEGORY);
          }}
          className={
            Style.GoodsSlider__category +
            " " +
            (selectedCategory === ALL_CATEGORY ? Style.selected : "")
          }
        >
          Любые товары
        </div>
        {categories.map((item) => (
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
        ))}
      </div>
      <div className={Style.GoodsSlider__listWrapper}>
        <button
          className={Style.GoodsSlider__navLeft}
          onClick={() => scrollBy("left")}
          aria-label="Scroll left"
        >
          <img src="/Goods/arrow.svg" alt="" />
        </button>
        <div ref={scrollEl} className={Style.GoodsSlider__list}>
          {filteredItems.map((item) => (
            <GoodsItem key={item.id} item={item} scrollEl={scrollEl} />
          ))}
        </div>
        <button
          className={Style.GoodsSlider__navRight}
          onClick={() => scrollBy("right")}
          aria-label="Scroll right"
        >
          <img src="/Goods/arrow.svg" alt="" />
        </button>
      </div>
    </div>
  );
}

type GoodsItemProps = {
  item: Product;
  scrollEl: RefObject<HTMLDivElement | null>;
};

function GoodsItem({ item, scrollEl }: GoodsItemProps) {
  const [isHover, setIsHover] = useState(false);
  const [isDefaultImg, setIsDefaultImg] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const elem = useRef<HTMLAnchorElement | null>(null);
  const { price, availability, rating } = item;

  const formattedPrice = `${currencyFormatter.format(price.current)} ₽`;
  const discountPrice =
    availability.hasDiscount && price.old
      ? `${currencyFormatter.format(price.old)} ₽`
      : null;

  const isDiscount = Boolean(discountPrice);
  const productHref = `/catalog/product/${item.slug}`;

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

  const likeIcon = (
    <img src="/Goods/like.svg" alt="like" className={Style.GoodsItem__like} />
  );
  const hitSign = <div className={Style.GoodsItem__hitSign}>ХИТ</div>;
  const discountPercent =
    price.old && price.old < price.current
      ? Math.round(((price.current - price.old) / price.current) * 100)
      : null;
  const discountSign =
    discountPercent !== null ? (
      <div className={Style.GoodsItem__discountSign}>-{discountPercent}%</div>
    ) : null;

  return (
    <a
      ref={elem}
      href={productHref}
      onMouseLeave={() => {
        setIsHover(false);
      }}
      onMouseEnter={() => {
        setIsHover(true);
      }}
      className={Style.GoodsItem + " " + (isHover ? Style.active : "")}
    >
      {isVisible ? (
        <img
          className={Style.GoodsItem__image}
          src={!isDefaultImg && item.media.thumbnail ? item.media.thumbnail : "/Goods/default.png"}
          alt={item.title}
          onError={() => {
            setIsDefaultImg(true);
          }}
        />
      ) : null}
      <div className={Style.GoodsItem__content + " " + Style.GoodsItem__snapItem}>
        <Rate rateSum={rating.score} commentsSum={rating.reviewsCount} />
        <h4 className={Style.GoodsItem__title}>{item.title}</h4>
        <p className={Style.GoodsItem__country}>{item.origin}</p>
        <div className={Style.GoodsItem__info}>
          <p className={Style.GoodsItem__price}>{formattedPrice}</p>
          <button className={Style.GoodsItem__button}>В корзину</button>
          {discountPrice ? (
            <div className={Style.GoodsItem__discount}>{discountPrice}</div>
          ) : (
            <div className={Style.GoodsItem__discount}></div>
          )}
        </div>
      </div>
      <div className={Style.GoodsItem__hoverBanner}>Быстрый просмотр</div>
      {likeIcon}
      {(availability.isHit || isDiscount) && (
        <div className={Style.GoodsItem__signs}>
          {availability.isHit ? hitSign : null}
          {isDiscount ? discountSign : null}
        </div>
      )}
    </a>
  );
}

function Rate({
  rateSum,
  commentsSum,
}: {
  rateSum: number;
  commentsSum: number;
}) {
  const fullStars = Math.floor(rateSum);
  const hasHalfStar = rateSum - fullStars >= 0.5;
  const stars = [] as JSX.Element[];

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <img key={`star-${i}`} src="/Goods/star.svg" alt="" className={Style.Rate__icon} />
    );
  }

  if (hasHalfStar) {
    stars.push(
      <img
        key="half-star"
        src="/Goods/halfStar.svg"
        alt=""
        className={Style.Rate__icon}
      />
    );
  }

  return (
    <div className={Style.Rate}>
      <span className={Style.Rate__stars}>{stars}</span>
      <span className={Style.Rate__comments}>
        <img src="/Goods/commentsIcon.svg" alt="" />
        {commentsSum}
      </span>
    </div>
  );
}

function createCategoryItems(
  ids: string[],
  map: Map<string, ProductCategory>
): CategoryItem[] {
  const seen = new Set<string>();
  return ids
    .map((id) => map.get(id))
    .filter((item): item is ProductCategory => Boolean(item))
    .filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    })
    .map((item) => ({ tag: item.id, text: item.title }));
}
