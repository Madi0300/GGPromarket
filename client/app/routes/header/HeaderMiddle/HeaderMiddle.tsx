import Style from "./HeaderMiddle.module.scss";
import { useState, useRef, useEffect } from "react";
import { Dropdown } from "../../headerBoard/ui";
import type { RootState } from "../../../store/store";
import {
  useGetHeaderDataQuery,
  useGetGoodDataByIdQuery,
} from "../../../store/apiSlise";
import { useAppSelector } from "#/hooks";
import { toogleLikesButton } from "#/clientStates";
import { useAppDispatch } from "#/hooks";
import { useNavigate } from "react-router";

type ButtonsCords = {
  like: { X: number; Y: number };
};

export default function HeaderMiddle() {
  const likedItemsId = JSON.parse(localStorage.getItem("likes") || "[]");
  const isLikesButtonTouched = useAppSelector(
    (state: RootState) => state.clientState.likesButtonTouched
  );
  const isLikedButtonTouched = useAppSelector(
    (state: RootState) => state.clientState.likeTouched
  );
  const [buttonsCords, setButtonsCords] = useState<ButtonsCords>({
    like: { X: 0, Y: 0 },
  });

  return (
    <>
      <div className={Style.HeaderMiddle}>
        <Categories />
        <Search />
        <ActionButtons setLikeButtonCords={setButtonsCords} />
        {isLikesButtonTouched ? (
          <GetGoodsListById
            cords={buttonsCords.like}
            likedItemsId={likedItemsId}
          />
        ) : null}
      </div>
    </>
  );
}

function Categories() {
  const { data, error, isLoading, isSuccess } = useGetHeaderDataQuery(null);

  const productCatalog = isSuccess ? data.productCatalog : [];

  const [toggleKey, setToggleKey] = useState(0);
  const catalog = useRef<HTMLDivElement | null>(null);

  function handleClickBurger(e: React.MouseEvent) {
    if (catalog.current && catalog.current.contains(e.target as Node)) return;
    setToggleKey((k) => k + 1);
  }

  return (
    <>
      <div className={Style.Categories}>
        <div className={Style.Categories__one}>
          <button
            aria-expanded={catalog.current != null}
            onClick={handleClickBurger}
            className={Style.Categories__burger}
          >
            <span></span>
            <span></span>
            <span></span>
            <Dropdown
              ref={catalog}
              items={productCatalog}
              toggleKey={toggleKey}
            />
          </button>
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
            <img src={`${import.meta.env.BASE_URL}header/search-icon.svg`} alt="" />
          </button>
        </form>
      </div>
    </>
  );
}

function ActionButtons({
  setLikeButtonCords,
}: {
  setLikeButtonCords: React.Dispatch<React.SetStateAction<ButtonsCords>>;
}) {
  const { data, isLoading, isSuccess, error } = useGetHeaderDataQuery(null);
  const dispatch = useAppDispatch();
  const likeElem = useRef<HTMLAnchorElement | null>(null);

  const likeTouchCounter = useAppSelector(
    (state) => state.clientState.likeTouched
  );

  const notificationSum = {
    user: 0,
    liked: JSON.parse(localStorage.getItem("likes") || "[]").length,
    cart: 0,
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

    setLikeButtonCords({
      like: {
        X: likeCords.left + window.scrollX,
        Y: likeCords.bottom + window.scrollY,
      },
    });
    dispatch(toogleLikesButton());
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
          <a href="#">
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

function LikedItem({ id }: { id: number }) {
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
  likedItemsId,
  cords,
}: {
  likedItemsId: number[];
  cords: { X: number; Y: number };
}) {
  const hasItems = likedItemsId && likedItemsId.length > 0;
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
          {likedItemsId.map((id) => (
            <LikedItem key={id} id={id} />
          ))}
        </ul>
      ) : (
        <p>Список понравившихся товаров пуст.</p>
      )}
    </div>
  );
}
