import Style from "./HeaderMiddle.module.scss";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Dropdown, InfoDropdown } from "../../headerBoard/ui";
import type { GoodsItem } from "@/types/goods";
import type { RootState } from "../../../store/store";
import { useGetGoodsDataQuery } from "../../../store/apiSlise";
import { useAppSelector, useAppDispatch } from "#/hooks";
import { toggleLike, toggleCart } from "#/clientStates";
import { headerData } from "../Header";

type ButtonsCords = {
  like: { X: number; Y: number };
  cart: { X: number; Y: number };
};

type AnchorTriggerEvent =
  | ReactMouseEvent<HTMLAnchorElement>
  | FocusEvent<HTMLAnchorElement>;

const DEFAULT_GOOD_IMAGE = `${import.meta.env.BASE_URL}Goods/default.webp`;
const LIKED_ICON = `${import.meta.env.BASE_URL}Goods/liked.png`;

const formatPrice = (value: number) =>
  value
    .toString()
    .split("")
    .reverse()
    .map((item, index) =>
      (index + 1) % 3 === 0 && index !== 0 ? " " + item : item
    )
    .reverse()
    .join("");

function useIsNarrowScreen(maxWidth: number) {
  const [isNarrow, setIsNarrow] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= maxWidth : false
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    function update() {
      setIsNarrow(window.innerWidth <= maxWidth);
    }

    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
    };
  }, [maxWidth]);

  return isNarrow;
}

export default function HeaderMiddle() {
  const likedItemsId = useAppSelector(
    (state: RootState) => state.clientState.likedItems
  );
  const cardItemsId = useAppSelector(
    (state: RootState) => state.clientState.cartItems
  );
  const [isLikesButtonTouched, setIsLikesButtonTouched] = useState(false);
  const [isCartButtonTouched, setIsCartButtonTouched] = useState(false);
  const [ButtonsCords, setButtonsCords] = useState<ButtonsCords>({
    like: { X: 0, Y: 0 },
    cart: { X: 0, Y: 0 },
  });

  const { data: goodsData } = useGetGoodsDataQuery(undefined);
  const itemsSum = useMemo(() => {
    if (!goodsData) return 0;
    return cardItemsId.reduce<number>((sum, itemId) => {
      const item = goodsData.find((good) => good.id === itemId);
      if (!item) {
        return sum;
      }
      const effectivePrice =
        typeof item.discount === "number" && item.discount < item.price
          ? item.discount
          : item.price;
      return sum + effectivePrice;
    }, 0);
  }, [cardItemsId, goodsData]);

  const [infoPopup, setInfoPopup] = useState({
    isOpen: false,
    message: "",
    cords: { X: 0, Y: 0 },
  });
  const infoMessage =
    "Данная функциональность на этом pet-проекте пока не реализована.";
  const showInfo = (event: AnchorTriggerEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setInfoPopup({
      isOpen: true,
      message: infoMessage,
      cords: {
        X: rect.left + rect.width / 2,
        Y: rect.bottom + 10,
      },
    });
  };

  const hideInfo = () => {
    setInfoPopup((prev) => (prev.isOpen ? { ...prev, isOpen: false } : prev));
  };

  return (
    <>
      <div className={Style.HeaderMiddle}>
        <InfoDropdown
          cords={infoPopup.cords}
          message={infoPopup.message}
          isOpen={infoPopup.isOpen}
        />
        <Categories onLinkHover={showInfo} onLinkLeave={hideInfo} />
        <Search />
        <ActionButtons
          setButtonCords={setButtonsCords}
          setIsCartButtonTouched={setIsCartButtonTouched}
          setIsLikesButtonTouched={setIsLikesButtonTouched}
          isLikesButtonTouched={isLikesButtonTouched}
          isCartButtonTouched={isCartButtonTouched}
        />
        {isLikesButtonTouched ? (
          <LikeDropdown
            cords={ButtonsCords.like}
            itemsId={likedItemsId}
            goodsData={goodsData}
            onClose={() => setIsLikesButtonTouched(false)}
          />
        ) : null}
        {isCartButtonTouched ? (
          <CartDropdown
            cords={ButtonsCords.cart}
            itemsId={cardItemsId}
            goodsData={goodsData}
            total={itemsSum}
            onClose={() => setIsCartButtonTouched(false)}
          />
        ) : null}
      </div>
    </>
  );
}

function Categories({
  onLinkHover,
  onLinkLeave,
}: {
  onLinkHover?: (event: AnchorTriggerEvent) => void;
  onLinkLeave?: () => void;
}) {
  const [isDropdownActive, setIsDropdownActive] = useState(false);

  const productCatalog = headerData.productCatalog;

  const [dropdownCords, setDropdownCords] = useState<{ X: number; Y: number }>({
    X: 0,
    Y: 0,
  });
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const burgerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isDropdownActive) return;

    function handleOutsideClick(event: globalThis.MouseEvent) {
      const target = event.target as Node;

      if (
        dropdownRef.current?.contains(target) ||
        burgerRef.current?.contains(target)
      ) {
        return;
      }

      setIsDropdownActive(false);
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isDropdownActive]);

  function handleClickBurger(e: ReactMouseEvent) {
    e.preventDefault();
    if (!burgerRef.current) return;

    const nextState = !isDropdownActive;

    if (nextState) {
      const burgerRect = burgerRef.current.getBoundingClientRect();
      setDropdownCords({
        X: burgerRect.left + window.scrollX,
        Y: burgerRect.bottom + window.scrollY,
      });
    }

    setIsDropdownActive(nextState);
  }

  return (
    <>
      <div className={Style.Categories}>
        <div
          className={`${Style.Categories__one} ${isDropdownActive ? Style.active : ""}`}
        >
          <button
            aria-expanded={isDropdownActive}
            onClick={handleClickBurger}
            className={Style.Categories__burger}
            ref={burgerRef}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <Dropdown
            ref={dropdownRef}
            items={productCatalog}
            cords={dropdownCords}
            isOpen={isDropdownActive}
            position="right"
          />
          <p
            className={`${Style.Categories__one__name} ${Style.Categories__title}`}
          >
            <Link to="/catalog">Каталог товаров</Link>
          </p>
        </div>
        <div className={`${Style.Categories__two} ${Style.Categories__title}`}>
          <Link to="/catalog?page=1&sale=1">Акции</Link>
        </div>
        <div
          className={`${Style.Categories__three} ${Style.Categories__title}`}
        >
          <a
            href="#"
            onMouseEnter={onLinkHover}
            onMouseLeave={onLinkLeave}
            onFocus={onLinkHover}
            onBlur={onLinkLeave}
          >
            Магазины
          </a>
        </div>
      </div>
    </>
  );
}

function Search() {
  const [value, setValue] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setValue(params.get("search") ?? "");
  }, [location.search]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextValue = value.trim();
    const params = new URLSearchParams();

    if (nextValue) {
      params.set("search", nextValue);
    }

    const search = params.toString();
    navigate(search ? `/catalog?${search}` : "/catalog");
  }

  return (
    <div className={Style.Search}>
      <form className={Style.Search__form} onSubmit={handleSubmit}>
        <input
          type="text"
          name="search-text"
          className={Style.Search__input}
          placeholder="Поиск по сайту"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <button type="submit" className={Style.Search__button}>
          <img
            src={`${import.meta.env.BASE_URL}header/search-icon.svg`}
            alt=""
          />
        </button>
      </form>
    </div>
  );
}

function ActionButtons({
  setButtonCords,
  setIsCartButtonTouched,
  setIsLikesButtonTouched,
  isLikesButtonTouched,
  isCartButtonTouched,
}: {
  setButtonCords: React.Dispatch<React.SetStateAction<ButtonsCords>>;
  setIsLikesButtonTouched: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCartButtonTouched: React.Dispatch<React.SetStateAction<boolean>>;
  isLikesButtonTouched: boolean;
  isCartButtonTouched: boolean;
}) {
  const dispatch = useAppDispatch();
  const likeElem = useRef<HTMLAnchorElement | null>(null);
  const cartElem = useRef<HTMLAnchorElement | null>(null);

  const notificationSum = {
    user: 0,
    liked: useAppSelector((state) => state.clientState.likedItems).length,
    cart: useAppSelector((state) => state.clientState.cartItems).length,
  };

  function notificationCreate(sum: number) {
    return (
      <div className={Style.ActionButtons__button__notification}>
        <img
          className={Style.ActionButtons__eliplse}
          src={`${import.meta.env.BASE_URL}header/elipse.svg`}
          alt=""
        />
        <span className={Style.ActionButtons__button__notification__sum}>
          {sum}
        </span>
      </div>
    );
  }

  function handleLikeClick(e: ReactMouseEvent) {
    e.preventDefault();
    if (!likeElem.current) return;
    const likeCords = likeElem.current?.getBoundingClientRect();
    if (!likeCords) return;

    setButtonCords((prevState) => ({
      ...prevState,
      like: {
        X: likeCords.left + window.scrollX,
        Y: likeCords.bottom + window.scrollY,
      },
    }));
    const nextState = !isLikesButtonTouched;
    if (nextState) {
      setIsCartButtonTouched(false);
    }
    setIsLikesButtonTouched(nextState);
  }
  function handleCartClick(e: ReactMouseEvent) {
    e.preventDefault();
    if (!cartElem.current) return;
    const cartCords = cartElem.current?.getBoundingClientRect();
    if (!cartCords) return;

    setButtonCords((prevState) => ({
      ...prevState,
      cart: {
        X: cartCords.left + window.scrollX,
        Y: cartCords.bottom + window.scrollY,
      },
    }));
    const nextState = !isCartButtonTouched;
    if (nextState) {
      setIsLikesButtonTouched(false);
    }
    setIsCartButtonTouched(nextState);
  }

  return (
    <>
      <div className={Style.ActionButtons}>
        <div className={Style.ActionButtons__button}>
          <a href="#">
            {notificationSum.user > 0
              ? notificationCreate(notificationSum.user)
              : null}
            <img
              className={Style.ActionButtons__button__icon}
              src={`${import.meta.env.BASE_URL}header/userButton.svg`}
              alt=""
            />
          </a>
        </div>
        <div className={Style.ActionButtons__button}>
          <a href="#" ref={likeElem} onClick={handleLikeClick}>
            {notificationSum.liked > 0
              ? notificationCreate(notificationSum.liked)
              : null}
            <img
              className={Style.ActionButtons__button__icon}
              src={`${import.meta.env.BASE_URL}header/likedButton.svg`}
              alt=""
            />
          </a>
        </div>
        <div className={Style.ActionButtons__button}>
          <a href="#" ref={cartElem} onClick={handleCartClick}>
            {notificationSum.cart > 0
              ? notificationCreate(notificationSum.cart)
              : null}
            <img
              className={Style.ActionButtons__button__icon}
              src={`${import.meta.env.BASE_URL}header/cartButton.svg`}
              alt=""
            />
          </a>
        </div>
      </div>
    </>
  );
}

type CartDropdownProps = {
  itemsId: number[];
  cords: { X: number; Y: number };
  goodsData?: GoodsItem[];
  total: number;
  onClose: () => void;
};

function CartDropdown({
  itemsId,
  cords,
  goodsData,
  total,
  onClose,
}: CartDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const isSmallScreen = useIsNarrowScreen(426);

  const baseProductPath = location.pathname.startsWith("/catalog")
    ? "/catalog"
    : "";
  const getProductPath = (id: number) =>
    `${baseProductPath}/product/${id}`.replace(/\/+/g, "/");

  const goodsInCart = useMemo(() => {
    if (!goodsData) return [];
    return itemsId
      .map((id) => goodsData.find((good) => good.id === id))
      .filter((item): item is GoodsItem => Boolean(item));
  }, [goodsData, itemsId]);

  const hasCartItems = itemsId.length > 0;
  const isLoading = hasCartItems && !goodsData;
  const hasLoadedItems = goodsInCart.length > 0;

  useEffect(() => {
    if (!dropdownRef.current) return;
    const leftX = dropdownRef.current.getBoundingClientRect().left;

    if (leftX < 0) {
      dropdownRef.current.style.left = "0px";
    }
  });

  const elemCords = isSmallScreen
    ? { top: 0, left: 0 }
    : { top: cords.Y, left: cords.X - 320 };

  const content = !hasCartItems ? (
    <p className={Style.CartDropdown__empty}>Корзина пуста.</p>
  ) : isLoading ? (
    <p className={Style.CartDropdown__empty}>Загружаем корзину…</p>
  ) : hasLoadedItems ? (
    <div className={Style.CartDropdown__items}>
      {goodsInCart.map((item) => {
        const discountValue =
          typeof item.discount === "number" ? item.discount : null;
        const hasDiscount = discountValue != null && discountValue < item.price;
        const displayPrice = hasDiscount ? discountValue : item.price;

        return (
          <article key={item.id} className={Style.CartDropdown__item}>
            <img
              className={Style.CartDropdown__itemImage}
              src={item.imgUrl}
              alt={item.name}
              onError={(event) => {
                event.currentTarget.src = DEFAULT_GOOD_IMAGE;
                event.currentTarget.onerror = null;
              }}
            />
            <div className={Style.CartDropdown__itemInfo}>
              <p className={Style.CartDropdown__itemTitle}>{item.name}</p>
              <div className={Style.CartDropdown__itemPriceRow}>
                <span className={Style.CartDropdown__priceCurrent}>
                  {formatPrice(displayPrice)} ₽
                </span>
                {hasDiscount ? (
                  <span className={Style.CartDropdown__priceOriginal}>
                    {formatPrice(item.price)} ₽
                  </span>
                ) : null}
              </div>
            </div>
            <div className={Style.CartDropdown__itemActions}>
              <button
                type="button"
                className={Style.CartDropdown__removeButton}
                aria-label={`Удалить ${item.name} из корзины`}
                onClick={() => dispatch(toggleCart(item.id))}
              >
                ×
              </button>
              <button
                type="button"
                className={Style.CartDropdown__buyButton}
                onClick={() => navigate(getProductPath(item.id))}
              >
                Открыть
              </button>
            </div>
          </article>
        );
      })}
    </div>
  ) : (
    <p className={Style.CartDropdown__empty}>
      Не удалось загрузить выбранные товары.
    </p>
  );

  return (
    <div ref={dropdownRef} style={elemCords} className={Style.CartDropdown}>
      <button
        type="button"
        className={Style.CartDropdown__closeButton}
        onClick={onClose}
        aria-label="Закрыть корзину"
      >
        ×
      </button>
      <div className={Style.CartDropdown__header}>
        <h3 className={Style.CartDropdown__title}>Корзина</h3>
      </div>
      {content}
      {hasLoadedItems ? (
        <div className={Style.CartDropdown__footer}>
          <div className={Style.CartDropdown__footerSummary}>
            <span className={Style.CartDropdown__footerLabel}>Сумма</span>
            <span className={Style.CartDropdown__footerAmount}>
              {formatPrice(total)} ₽
            </span>
          </div>
          <button type="button" className={Style.CartDropdown__footerButton}>
            Купить все
          </button>
        </div>
      ) : null}
    </div>
  );
}

type LikeDropdownProps = {
  itemsId: number[];
  cords: { X: number; Y: number };
  goodsData?: GoodsItem[];
  onClose: () => void;
};

function LikeDropdown({
  itemsId,
  cords,
  goodsData,
  onClose,
}: LikeDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isSmallScreen = useIsNarrowScreen(426);

  const baseProductPath = location.pathname.startsWith("/catalog")
    ? "/catalog"
    : "";
  const getProductPath = (id: number) =>
    `${baseProductPath}/product/${id}`.replace(/\/+/g, "/");

  const likedGoods = useMemo(() => {
    if (!goodsData) return [];
    return itemsId
      .map((id) => goodsData.find((good) => good.id === id))
      .filter((item): item is GoodsItem => Boolean(item));
  }, [goodsData, itemsId]);

  const hasItems = itemsId.length > 0;
  const isLoading = hasItems && !goodsData;
  const hasLoadedItems = likedGoods.length > 0;

  useEffect(() => {
    if (!dropdownRef.current) return;
    const leftX = dropdownRef.current.getBoundingClientRect().left;

    if (leftX < 0) {
      dropdownRef.current.style.left = "0px";
    }
  });

  const elemCords = isSmallScreen
    ? { top: 0, left: 0 }
    : { top: cords.Y, left: cords.X - 320 };

  const content = !hasItems ? (
    <p className={Style.CartDropdown__empty}>Избранное пусто.</p>
  ) : isLoading ? (
    <p className={Style.CartDropdown__empty}>Загружаем избранное…</p>
  ) : hasLoadedItems ? (
    <div className={Style.CartDropdown__items}>
      {likedGoods.map((item) => {
        const discountValue =
          typeof item.discount === "number" ? item.discount : null;
        const hasDiscount = discountValue != null && discountValue < item.price;
        const displayPrice = hasDiscount ? discountValue : item.price;

        return (
          <article key={item.id} className={Style.CartDropdown__item}>
            <img
              className={Style.CartDropdown__itemImage}
              src={item.imgUrl}
              alt={item.name}
              onError={(event) => {
                event.currentTarget.src = DEFAULT_GOOD_IMAGE;
                event.currentTarget.onerror = null;
              }}
            />
            <div className={Style.CartDropdown__itemInfo}>
              <p className={Style.CartDropdown__itemTitle}>{item.name}</p>
              <div className={Style.CartDropdown__itemPriceRow}>
                <span className={Style.CartDropdown__priceCurrent}>
                  {formatPrice(displayPrice)} ₽
                </span>
                {hasDiscount ? (
                  <span className={Style.CartDropdown__priceOriginal}>
                    {formatPrice(item.price)} ₽
                  </span>
                ) : null}
              </div>
            </div>
            <div className={Style.CartDropdown__itemActions}>
              <button
                type="button"
                className={Style.CartDropdown__removeButton}
                aria-label={`Убрать ${item.name} из избранного`}
                onClick={() => dispatch(toggleLike(item.id))}
              >
                <img
                  className={Style.CartDropdown__likedIcon}
                  src={LIKED_ICON}
                  alt=""
                />
              </button>
              <button
                type="button"
                className={Style.CartDropdown__buyButton}
                onClick={() => navigate(getProductPath(item.id))}
              >
                Купить
              </button>
            </div>
          </article>
        );
      })}
    </div>
  ) : (
    <p className={Style.CartDropdown__empty}>
      Не удалось загрузить понравившиеся товары.
    </p>
  );

  return (
    <div ref={dropdownRef} style={elemCords} className={Style.CartDropdown}>
      <button
        type="button"
        className={Style.CartDropdown__closeButton}
        onClick={onClose}
        aria-label="Закрыть избранное"
      >
        ×
      </button>
      <div className={Style.CartDropdown__header}>
        <h3 className={Style.CartDropdown__title}>Избранное</h3>
      </div>
      {content}
    </div>
  );
}
