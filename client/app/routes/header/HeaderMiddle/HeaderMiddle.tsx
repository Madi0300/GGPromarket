import Style from "./HeaderMiddle.module.scss";
import { useState, useRef } from "react";
import { Dropdown } from "../../headerBoard/ui";
import type { RootState } from "../../../store/store";
import { useGetHeaderDataQuery } from "../../../store/apiSlise";

export default function HeaderMiddle() {
  return (
    <>
      <div className={Style.HeaderMiddle}>
        <Categories />
        <Search />
        <ActionButtons />
      </div>
    </>
  );
}

function Categories() {
  const { data, error, isLoading, isSuccess } = useGetHeaderDataQuery();

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
            <img src="/header/search-icon.svg" alt="" />
          </button>
        </form>
      </div>
    </>
  );
}

function ActionButtons() {
  const { data, isLoading, isSuccess, error } = useGetHeaderDataQuery();

  const notificationSum = isSuccess
    ? data.notificationSum
    : {
        user: 0,
        liked: 0,
        cart: 0,
      };

  function notificationCreate(sum: number) {
    return (
      <div className={Style.ActionButtons__button__notification}>
        <img
          className={Style.ActionButtons__eliplse}
          src="/header/elipse.svg"
          alt=""
        />
        <span className={Style.ActionButtons__button__notification__sum}>
          {sum}
        </span>
      </div>
    );
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
              src="/header/userButton.svg"
              alt=""
            />
          </a>
        </div>
        <div className={Style.ActionButtons__button}>
          <a href="#">
            {notificationSum.liked > 0
              ? notificationCreate(notificationSum.liked)
              : null}
            <img
              className={Style.ActionButtons__button__icon}
              src="/header/likedButton.svg"
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
              src="/header/cartButton.svg"
              alt=""
            />
          </a>
        </div>
      </div>
    </>
  );
}
