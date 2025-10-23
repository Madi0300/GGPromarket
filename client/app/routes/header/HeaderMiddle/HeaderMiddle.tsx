import Style from "./HeaderMiddle.module.scss";
import { useState, useRef, useEffect, useMemo } from "react";
import { Dropdown } from "../../headerBoard/ui";
import type { RootState } from "../../../store/store";
import {
  useGetHeaderDataQuery,
  useGetGoodDataByIdQuery,
  useGetGoodsDataQuery,
} from "../../../store/apiSlise";
import { useAppSelector } from "#/hooks";
import { toogleLikesButton, toogleCartButton } from "#/clientStates";
import { useAppDispatch } from "#/hooks";
import { useNavigate } from "react-router";

type ButtonsCords = {
  like: { X: number; Y: number };
  cart: { X: number; Y: number };
};

type GoodsPricePreview = {
  id: number;
  price: number;
};

export default function HeaderMiddle() {
  const likedItemsId = JSON.parse(
    localStorage.getItem("likes") || "[]"
  ) as number[];
  const cardItemsId = JSON.parse(
    localStorage.getItem("cart") || "[]"
  ) as number[];
  const isLikesButtonTouched = useAppSelector(
    (state: RootState) => state.clientState.likesButtonTouched
  );
  const isLikedButtonTouched = useAppSelector(
    (state: RootState) => state.clientState.likeTouched
  );
  const isCartButtonTouched = useAppSelector(
    (state: RootState) => state.clientState.cartButtonTouched
  );
  const [ButtonsCords, setButtonsCords] = useState<ButtonsCords>({
    like: { X: 0, Y: 0 },
    cart: { X: 0, Y: 0 },
  });

  const { data: goodsData } = useGetGoodsDataQuery(null);
  const itemsSum = useMemo(() => {
    if (!goodsData) return 0;
    const goodsList = goodsData as GoodsPricePreview[];
    return cardItemsId.reduce<number>((sum, itemId) => {
      const item = goodsList.find((good) => good.id === itemId);
      return item ? sum + item.price : sum;
    }, 0);
  }, [cardItemsId, goodsData]);

  return (
    <>
      <div className={Style.HeaderMiddle}>
        <Categories />
        <Search />
        <ActionButtons setButtonCords={setButtonsCords} />
        {isLikesButtonTouched ? (
          <GetGoodsListById cords={ButtonsCords.like} itemsId={likedItemsId} />
        ) : null}
        {isCartButtonTouched ? (
          <>
            <GetGoodsListById cords={ButtonsCords.cart} itemsId={cardItemsId} />
            <div
              className={Style.HeaderMiddle__cartSum}
              style={{
                position: "absolute",
                left: `${ButtonsCords.cart.X - 300}px`,
                top: `${ButtonsCords.cart.Y - 40}px`,
              }}
            >
              Общий счет: {itemsSum}₽
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}

function Categories() {
  const { data, error, isLoading, isSuccess } = useGetHeaderDataQuery(null);
  const [isDropdownActive, setIsDropdownActive] = useState(false);

  const productCatalog = isSuccess ? data.productCatalog : [];

  const [dropdownCords, setDropdownCords] = useState<{ X: number; Y: number }>({
    X: 0,
    Y: 0,
  });
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const burgerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isDropdownActive) return;

    function handleOutsideClick(event: MouseEvent) {
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

  function handleClickBurger(e: React.MouseEvent) {
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
            <a href="#">Каталог товаров</a>
          </p>
        </div>
        <div className={`${Style.Categories__two} ${Style.Categories__title}`}>
          <a href="#">Акции</a>
        </div>
        <div
          className={`${Style.Categories__three} ${Style.Categories__title}`}
        >
          <a href="#">Магазины</a>
        </div>
      </div>
    </>
  );
}

function Search() {
  return (
    <>
      <div className={Style.Search}>
        <form className={Style.Search__form} action="#/" method="get">
          <input
            type="text"
            name="search-text"
            className={Style.Search__input}
            placeholder="Поиск по сайту"
          />
          <button type="submit" className={Style.Search__button}>
            <img
              src={`${import.meta.env.BASE_URL}header/search-icon.svg`}
              alt=""
            />
          </button>
        </form>
      </div>
    </>
  );
}

function ActionButtons({
  setButtonCords,
}: {
  setButtonCords: React.Dispatch<React.SetStateAction<ButtonsCords>>;
}) {
  const { data, isLoading, isSuccess, error } = useGetHeaderDataQuery(null);
  const dispatch = useAppDispatch();
  const likeElem = useRef<HTMLAnchorElement | null>(null);
  const cartElem = useRef<HTMLAnchorElement | null>(null);

  const likeTouchCounter = useAppSelector(
    (state) => state.clientState.likeTouched
  );

  const notificationSum = {
    user: 0,
    liked: JSON.parse(localStorage.getItem("likes") || "[]").length,
    cart: JSON.parse(localStorage.getItem("cart") || "[]").length,
  };

  //Система лайка можно в любое время изменить для получения от сервера
  //В данном случае я просто буду использовать localStorage

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

  function handleLikeClick(e: React.MouseEvent) {
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
    dispatch(toogleLikesButton());
  }
  function handleCartClick(e: React.MouseEvent) {
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
    dispatch(toogleCartButton());
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

function GetItem({ id }: { id: number }) {
  const { data, isSuccess } = useGetGoodDataByIdQuery(id);
  const navigate = useNavigate();

  if (!isSuccess) {
    return null;
  }

  function handleLinkClick(e: React.MouseEvent) {
    e.preventDefault();
    navigate(`/product/${id}`, { preventScrollReset: true });
  }

  return (
    <li className={Style.LikedGoods__item}>
      <a
        className={Style.LikedGoods__item__link}
        href={data.href}
        onClick={handleLinkClick}
      >
        {data.name}
      </a>
    </li>
  );
}

function GetGoodsListById({
  itemsId,
  cords,
}: {
  itemsId: number[];
  cords: { X: number; Y: number };
}) {
  const hasItems = itemsId && itemsId.length > 0;
  const likedGoodsElem = useRef<HTMLDivElement | null>(null);

  const elemCords = {
    top: cords.Y,
    left: cords.X - 320,
  };

  useEffect(() => {
    if (!likedGoodsElem.current) return;
    const leftX = likedGoodsElem.current.getBoundingClientRect().left;

    if (leftX < 0) {
      likedGoodsElem.current.style.left = "0px";
    }
  });

  return (
    <div ref={likedGoodsElem} style={elemCords} className={Style.LikedGoods}>
      {hasItems ? (
        <ul className={Style.LikedGoods__list}>
          {itemsId.map((id) => (
            <GetItem key={id} id={id} />
          ))}
        </ul>
      ) : (
        <p>Список понравившихся товаров пуст.</p>
      )}
    </div>
  );
}
