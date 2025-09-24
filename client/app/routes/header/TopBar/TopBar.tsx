import { Logo, Dropdown } from "../../headerBoard/ui";
import Style from "./TopBar.module.scss";
import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { Call } from "../../headerBoard/ui";

export default function TopBar() {
  const currentLocation = useSelector(
    (state: RootState) => state.app.currentLocation
  );
  const callNumber = useSelector((state: RootState) => state.app.callNumber);
  return (
    <>
      <div className={Style.TopBar}>
        <Logo />
        <City city={currentLocation} />
        <Call number={callNumber} />
        <Navigation />
      </div>
    </>
  );
}

function City({ city = "Москва" }: { city?: string }) {
  return (
    <>
      <a className={Style.City} href="#">
        <img className={Style.City__icon} src="/header/location-icon.svg" />
        <span className={(Style.City__text, Style.underlined)}>{city}</span>
      </a>
    </>
  );
}

type NavLink = {
  name: string;
  href: string;
};

function Navigation() {
  const navLinks: NavLink[] = [
    { name: "Каталог", href: "#" },
    { name: "Доставка", href: "#" },
    { name: "Скидки", href: "#" },
    { name: "Бренды", href: "#" },
    { name: "Контакты", href: "#" },
  ];

  const [toggleKey, setToggleKey] = useState(0);
  const catalog = useRef<HTMLDivElement | null>(null);

  function handleClickBurger(e: React.MouseEvent) {
    if (catalog.current && catalog.current.contains(e.target as Node)) return;
    setToggleKey((k) => k + 1);
  }

  return (
    <>
      <button onClick={handleClickBurger} className={Style.Navigation__Burger}>
        <span></span>
        <span></span>
        <span></span>
        <Dropdown
          position={"right"}
          ref={catalog}
          items={navLinks}
          toggleKey={toggleKey}
        />
      </button>
      <div className={Style.Navigation__Nav}>
        {navLinks.map((item) => {
          return (
            <span key={item.name} className={Style.Navigation__item}>
              {item.name}
            </span>
          );
        })}
      </div>
    </>
  );
}
