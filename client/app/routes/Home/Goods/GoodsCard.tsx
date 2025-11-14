import { memo, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import Style from "./Goods.module.scss";
import { Rate } from "@/headerBoard/ui";
import { useAppDispatch, useAppSelector } from "#/hooks";
import { toggleCart, toggleLike } from "#/clientStates";
import type { GoodsItem } from "@/types/goods";

const formatPrice = (value: number) =>
  value
    .toString()
    .split("")
    .reverse()
    .map((item, index) => ((index + 1) % 3 === 0 && index !== 0 ? " " + item : item))
    .reverse()
    .join("");

type GoodsCardProps = {
  item: GoodsItem;
  scrollContainer?: React.RefObject<HTMLDivElement | null>;
  productRoutePrefix?: string;
  locationSearch?: string;
};

const GoodsCard = memo(
  ({
    item,
    scrollContainer,
    productRoutePrefix = "",
    locationSearch = "",
  }: GoodsCardProps) => {
  const [isDefaultImg, setIsDefaultImg] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const elem = useRef<HTMLAnchorElement | null>(null);
  const likeElem = useRef<HTMLImageElement | null>(null);
  const cartElem = useRef<HTMLButtonElement | null>(null);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const isLiked = useAppSelector((state) => state.clientState.likedItems).includes(
    item.id
  );
  const isInCart = useAppSelector((state) => state.clientState.cartItems).includes(
    item.id
  );

  const price = formatPrice(item.price);
  const hasDiscount = typeof item.discount === "number";
  const discountValue = hasDiscount ? (item.discount as number) : null;
  const discount = discountValue != null ? formatPrice(discountValue) : null;

  const isDiscount = discountValue != null && item.price > 0;

  const discountItem = (
    <p className={Style.GoodsItem__discount}>
      {discountValue != null && discountValue > item.price
        ? discount
        : price + " ₽"}
    </p>
  );
  const nullItem = <div className={Style.GoodsItem__nullItem}></div>;
  const discountSign = <div className={Style.GoodsItem__discountSign}>АКЦИЯ</div>;
  const hitSign = <div className={Style.GoodsItem__hitSign}>ХИТ</div>;

  const goodItemSigns = (
    <div className={Style.GoodsItem__signs}>
      {item.isHit ? hitSign : null}
      {isDiscount ? discountSign : null}
    </div>
  );

  useEffect(() => {
    if (!elem.current || isVisible) return;
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
        root: scrollContainer?.current ?? null,
        rootMargin: "300px",
        threshold: 0.1,
      }
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [isVisible, scrollContainer]);

  const handleClickCard = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    if (likeElem.current && e.target === likeElem.current) {
      dispatch(toggleLike(item.id));
      return;
    }

    if (cartElem.current && e.target === cartElem.current) {
      dispatch(toggleCart(item.id));
      return;
    }

    const basePath = productRoutePrefix.replace(/\/$/, "");
    const normalizedBase = basePath || "";
    const normalizedSearch = locationSearch
      ? locationSearch.startsWith("?")
        ? locationSearch
        : `?${locationSearch}`
      : "";
    const targetSegment = normalizedBase
      ? `${normalizedBase}/product/${item.id}`
      : `/product/${item.id}`;
    const targetWithSearch = `${targetSegment}${normalizedSearch}`;
    const returnPath = normalizedBase
      ? `${normalizedBase}${normalizedSearch}`
      : "/";
    const normalizedTarget = targetWithSearch.replace(/\/\/+/g, "/");
    navigate(normalizedTarget, {
      preventScrollReset: true,
      state: {
        returnTo: returnPath,
        scrollY: window.scrollY,
      },
    });
  };

  return (
    <a
      ref={elem}
      href={item.href}
      onMouseLeave={() => setIsHover(false)}
      onMouseEnter={() => setIsHover(true)}
      onClick={handleClickCard}
      className={Style.GoodsItem + " " + (isHover ? Style.active : "")}
    >
      {isVisible ? (
        <img
          className={Style.GoodsItem__image}
          src={
            !isDefaultImg
              ? item.imgUrl
              : `${import.meta.env.BASE_URL}Goods/default.webp`
          }
          alt=""
          onError={() => setIsDefaultImg(true)}
        />
      ) : null}
      <div className={Style.GoodsItem__content}>
        <Rate rateSum={item.rate} commentsSum={item.commentsSum} />
        <h4 className={Style.GoodsItem__title}>{item.name}</h4>
        <p className={Style.GoodsItem__country}>{item.country}</p>
        <div className={Style.GoodsItem__info}>
          <p className={Style.GoodsItem__price}>
            {discountValue != null && discountValue < item.price
              ? discount
              : price + " ₽"}
          </p>
          <button ref={cartElem} className={Style.GoodsItem__button}>
            {isInCart ? "В корзине" : "В корзину"}
          </button>
          {discountValue != null ? discountItem : nullItem}
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
      {isDiscount || item.isHit ? goodItemSigns : null}
    </a>
  );
});

export default GoodsCard;
