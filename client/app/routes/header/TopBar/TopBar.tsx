import { Logo, InfoDropdown } from "../../headerBoard/ui";
import Style from "./TopBar.module.scss";
import {
  useState,
  type MouseEvent,
  type FocusEvent,
} from "react";
import type { RootState } from "../../../store/store";
import { Call } from "../../headerBoard/ui";
import MobileNavigation from "@/header/MobileNavigation/MobileNavigation";
import { headerData } from "../Header";
import { Link } from "react-router";

type AnchorTriggerEvent =
  | MouseEvent<HTMLAnchorElement>
  | FocusEvent<HTMLAnchorElement>;

export default function TopBar() {
  const currentLocation = headerData.currentLocation;
  const callNumber = headerData.callNumber;
  const [infoPopup, setInfoPopup] = useState({
    isOpen: false,
    message: "",
    cords: { X: 0, Y: 0 },
  });

  const infoMessage =
    "Данная функциональность в этом pet-проекте пока не реализована.";
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
      <div className={Style.TopBar}>
        <InfoDropdown
          cords={infoPopup.cords}
          message={infoPopup.message}
          isOpen={infoPopup.isOpen}
        />
        <Logo />
        <City
          city={currentLocation}
          onHover={showInfo}
          onLeave={hideInfo}
          onFocus={showInfo}
          onBlur={hideInfo}
        />
        <Call number={callNumber} />
        <Navigation
          onUnavailableHover={showInfo}
          onUnavailableLeave={hideInfo}
        />
      </div>
    </>
  );
}

function City({
  city = "Москва",
  onHover,
  onLeave,
}: {
  city?: string;
  onHover?: (event: MouseEvent<HTMLAnchorElement>) => void;
  onLeave?: () => void;
}) {
  return (
    <>
      <a
        className={Style.City}
        href="#"
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        onFocus={onHover}
        onBlur={onLeave}
      >
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

function Navigation({
  onUnavailableHover,
  onUnavailableLeave,
}: {
  onUnavailableHover?: (event: AnchorTriggerEvent) => void;
  onUnavailableLeave?: () => void;
}) {
  const navLinks: NavLink[] = [
    { name: "Каталог", href: "/catalog" },
    { name: "Доставка", href: "/#" },
    { name: "Скидки", href: "/catalog?page=1&sale=1" },
    { name: "Бренды", href: "/#" },
    { name: "Контакты", href: "/#" },
  ];

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  function toggleIsdropdownOpen() {
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
            <Link
              to={item.href}
              key={item.name}
              className={Style.Navigation__item}
              onMouseEnter={
                item.href.includes("#") ? onUnavailableHover : undefined
              }
              onMouseLeave={
                item.href.includes("#") ? onUnavailableLeave : undefined
              }
              onFocus={
                item.href.includes("#") ? onUnavailableHover : undefined
              }
              onBlur={
                item.href.includes("#") ? onUnavailableLeave : undefined
              }
            >
              {item.name}
            </Link>
          );
        })}
      </div>
    </>
  );
}
