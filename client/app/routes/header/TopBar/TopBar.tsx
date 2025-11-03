import { Logo, Dropdown } from "../../headerBoard/ui";
import Style from "./TopBar.module.scss";
import { useState, useRef, useEffect } from "react";
import type { RootState } from "../../../store/store";
import { Call } from "../../headerBoard/ui";
import MobileNavigation from "@/header/MobileNavigation/MobileNavigation";
import { headerData } from "../Header";

export default function TopBar() {
  const currentLocation = headerData.currentLocation;
  const callNumber = headerData.callNumber;

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
        <img
          className={Style.City__icon}
          src={`${import.meta.env.BASE_URL}header/location-icon.svg`}
        />
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
    { name: "Каталог", href: "/catalog" },
    { name: "Доставка", href: "/order" },
    { name: "Скидки", href: "/discounts" },
    { name: "Бренды", href: "/brands" },
    { name: "Контакты", href: "/contacts" },
  ];

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  function toggleIsdropdownOpen(e: React.MouseEvent) {
    setIsDropdownOpen(!isDropdownOpen);
  }

  return (
    <>
      <button
        onClick={toggleIsdropdownOpen}
        className={Style.Navigation__Burger}
        aria-expanded={isDropdownOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      {isDropdownOpen ? (
        <MobileNavigation
          navItems={navLinks}
          toggleIsdropdownOpen={toggleIsdropdownOpen}
        />
      ) : null}
      <div className={Style.Navigation__Nav}>
        {navLinks.map((item) => {
          return (
            <a
              href={item.href}
              key={item.name}
              className={Style.Navigation__item}
            >
              {item.name}
            </a>
          );
        })}
      </div>
    </>
  );
}
