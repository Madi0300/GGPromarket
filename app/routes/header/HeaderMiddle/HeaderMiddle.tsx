import Style from "./HeaderMiddle.module.scss";
import { useState, useRef, useEffect, use } from "react";

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
  const productCatalog = [
    { name: "Унитазы", href: "#" },
    { name: "Ванны", href: "#" },
    { name: "Раковины", href: "#" },
    { name: "Душевые кабины", href: "#" },
    { name: "Смесители", href: "#" },
    { name: "Биде", href: "#" },
    { name: "Аксессуары", href: "#" },
  ];

  const catalog = useRef<HTMLDivElement>(null);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [toggleKey, setToggleKey] = useState(0);

  const productCatalogJSX = isCatalogOpen ? (
    <div ref={catalog} className={Style.Categories__catalog}>
      <ul className={Style.Categories__ul}>
        {productCatalog.map((item) => {
          return (
            <li key={item.name} className={Style.Categories__li}>
              <a href={item.href}>{item.name}</a>
            </li>
          );
        })}
      </ul>
    </div>
  ) : null;
  function handleClickBurger(e: React.MouseEvent) {
    if (catalog.current && catalog.current.contains(e.target as Node)) return;
    setToggleKey(toggleKey + 1);

    console.log("click");
  }

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isCatalogOpen && toggleKey > 0) {
      timer = setTimeout(() => {
        setIsCatalogOpen(true);
      }, 0);
    } else {
      if (catalog.current) {
        catalog.current.classList.remove(Style.Categories__catalog__active);
      }
      timer = setTimeout(() => {
        if (!catalog.current) return;
        catalog.current.classList.remove(Style.Categories__catalog__active);
        setIsCatalogOpen(false);
      }, 300);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [toggleKey]);

  useEffect(() => {
    if (isCatalogOpen && catalog.current) {
      console.log(catalog.current);
      catalog.current.classList.add(Style.Categories__catalog__active);
    }
  }, [isCatalogOpen]);

  return (
    <>
      <div className={Style.Categories}>
        <div className={Style.Categories__one}>
          <div onClick={handleClickBurger} className={Style.Categories__burger}>
            <span></span>
            <span></span>
            <span></span>
            {productCatalogJSX}
          </div>
          <p
            className={`${Style.Categories__one__name} ${Style.Categories__title}`}
          >
            КАТАЛОГ ТОВАРОВ
          </p>
        </div>
        <div className={`${Style.Categories__two} ${Style.Categories__title}`}>
          АКЦИИ
        </div>
        <div
          className={`${Style.Categories__three} ${Style.Categories__title}`}
        >
          БРЕНДЫ
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
            placeholder="Что вы ищете?"
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
  const notificationSum = {
    user: 0,
    liked: 4,
    cart: 2,
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
