import { Logo, Dropdown } from "../../headerBoard/ui";
import Style from "./TopBar.module.scss";
import { useState, useRef, useEffect } from "react";
import type { RootState } from "../../../store/store";
import { Call } from "../../headerBoard/ui";
import { useGetHeaderDataQuery } from "../../../store/apiSlise";

export default function TopBar() {
  const { data, error, isLoading, isSuccess } = useGetHeaderDataQuery(null);

  const currentLocation = isSuccess ? data.currentLocation : "";
  const callNumber = isSuccess ? data.callNumber : "";

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
        <img className={Style.City__icon} src={`${import.meta.env.BASE_URL}header/location-icon.svg`} />
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
  const [dropdownCords, setDropdownCords] = useState<{ X: number; Y: number }>({
    X: 0,
    Y: 0,
  });
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const burgerRef = useRef<HTMLButtonElement | null>(null);

  function handleClickBurger(e: React.MouseEvent) {
    e.preventDefault();
    if (!burgerRef.current) return;

    const nextState = !isDropdownOpen;

    if (nextState) {
      const burgerRect = burgerRef.current.getBoundingClientRect();
      setDropdownCords({
        X: burgerRect.left + window.scrollX,
        Y: burgerRect.bottom + window.scrollY,
      });
    }

    setIsDropdownOpen(nextState);
  }

  useEffect(() => {
    if (!isDropdownOpen) return;

    function handleOutsideClick(event: MouseEvent) {
      const target = event.target as Node;

      if (
        dropdownRef.current?.contains(target) ||
        burgerRef.current?.contains(target)
      ) {
        return;
      }

      setIsDropdownOpen(false);
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isDropdownOpen]);

  return (
    <>
      <button
        onClick={handleClickBurger}
        className={Style.Navigation__Burger}
        ref={burgerRef}
        aria-expanded={isDropdownOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <Dropdown
        position={"right"}
        ref={dropdownRef}
        items={navLinks}
        cords={dropdownCords}
        isOpen={isDropdownOpen}
      />
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
