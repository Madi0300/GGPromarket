import { useMemo, useRef, useState } from "react";
import { Logo, Dropdown, Call } from "../../headerBoard/ui";
import Style from "./TopBar.module.scss";
import type { NavigationLink } from "../../../api/types";

type TopBarProps = {
  city?: string;
  supportPhone?: string;
  rawPhone?: string;
  navigation?: NavigationLink[];
};

export default function TopBar({
  city = "Москва",
  supportPhone,
  rawPhone,
  navigation = [],
}: TopBarProps) {
  const navItems = useMemo(
    () => navigation.map((item) => ({ name: item.label, href: item.href })),
    [navigation]
  );

  return (
    <div className={Style.TopBar}>
      <Logo />
      <City city={city} />
      <Call number={supportPhone ?? "+7 (495) 018-32-10"} rawNumber={rawPhone} />
      <Navigation links={navItems} />
    </div>
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

function Navigation({ links = [] }: { links?: NavLink[] }) {
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
          items={links}
          toggleKey={toggleKey}
        />
      </button>
      <div className={Style.Navigation__Nav}>
        {links.map((item) => {
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
