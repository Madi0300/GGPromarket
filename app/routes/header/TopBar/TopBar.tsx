import { Logo } from "../../headerBoard/headerBoard";
import Style from "./TopBar.module.scss";

export default function TopBar() {
  return (
    <>
      <div className={Style.TopBar}>
        <Logo width={296} height={33.21} />
        <City />
        <Call />
        <Navigation />
      </div>
    </>
  );
}

function City({ city = "Москва" }: { city: string }) {
  return (
    <>
      <div className={Style.City}>
        <img className={Style.City__icon} src="/header/location-icon.svg" />
        <span className={(Style.City__text, Style.underlined)}>{city}</span>
      </div>
    </>
  );
}

function Call({ number = 84950183210 }: { number: number }) {
  const stringedNumber = `${number}`;
  const formattedPhone: string = `${stringedNumber[0]} ${stringedNumber.slice(1, 4)} ${stringedNumber.slice(4, 7)}-${stringedNumber.slice(7, 9)}-${stringedNumber.slice(9)}`;
  return (
    <>
      <div className={Style.Call}>
        <span className={Style.Call__number}>{formattedPhone}</span>
        <img src="/header/showMore.svg" alt="" />
        <a
          className={(Style.Call__link, Style.underlined)}
          href={"tel:" + stringedNumber}
        >
          Заказать звонок
        </a>
      </div>
    </>
  );
}

type NavLink = {
  name: string;
  href: string;
};

function Navigation() {
  const navLinks: NavLink[] = [
    { name: "Оплата", href: "#" },
    { name: "Доставка", href: "#" },
    { name: "Поставщикам", href: "#" },
    { name: "Статьи", href: "#" },
    { name: "Контакты", href: "#" },
  ];

  return (
    <>
      <div className={Style.Navigation}>
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
