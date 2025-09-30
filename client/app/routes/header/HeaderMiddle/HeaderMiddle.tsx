import Style from "./HeaderMiddle.module.scss";
import { useMemo, useRef, useState } from "react";
import { Dropdown } from "../../headerBoard/ui";
import type { NavigationLink, AppConfig } from "../../../api/types";

type HeaderMiddleProps = {
  catalog?: NavigationLink[];
  counters?: AppConfig["counters"];
};

export default function HeaderMiddle({
  catalog = [],
  counters,
}: HeaderMiddleProps) {
  return (
    <div className={Style.HeaderMiddle}>
      <Categories items={catalog} />
      <Search />
      <ActionButtons counters={counters} />
    </div>
  );
}

function Categories({ items }: { items: NavigationLink[] }) {
  const dropdownItems = useMemo(
    () => items.map((item) => ({ name: item.label, href: item.href })),
    [items]
  );

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
              items={dropdownItems}
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
          <a href="/discounts">Акции</a>
        </div>
        <div
          className={`${Style.Categories__three} ${Style.Categories__title}`}
        >
          <a href="/stores">Магазины</a>
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

function ActionButtons({
  counters,
}: {
  counters?: AppConfig["counters"];
}) {
  const notificationCreate = (sum: number) => {
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
  };

  const values = counters ?? { user: 0, favourites: 0, cart: 0 };

  return (
    <>
      <div className={Style.ActionButtons}>
        <div className={Style.ActionButtons__button}>
          <a href="#">
            {values.user > 0 ? notificationCreate(values.user) : null}
            <img
              className={Style.ActionButtons__button__icon}
              src="/header/userButton.svg"
              alt=""
            />
          </a>
        </div>
        <div className={Style.ActionButtons__button}>
          <a href="#">
            {values.favourites > 0
              ? notificationCreate(values.favourites)
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
            {values.cart > 0 ? notificationCreate(values.cart) : null}
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
