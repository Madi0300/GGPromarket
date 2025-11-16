import Style from "./footerMain.module.scss";
import { Logo, PhoneNumber, InfoDropdown } from "../../headerBoard/ui";
import { Container } from "../../headerBoard/ui";
import { headerData } from "@/header/Header";
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type FocusEvent,
} from "react";

type AnchorTriggerEvent =
  | MouseEvent<HTMLAnchorElement>
  | FocusEvent<HTMLAnchorElement>;
const footerData = {
  productLinks: [
    {
      name: "Посудомоечные машины",
      href: "/catalog?page=1&categories=Dishwashers",
    },
    { name: "Смесители", href: "/catalog?page=1&categories=Faucets" },
    { name: "Обогреватели", href: "/catalog?page=1&categories=Heaters" },
    { name: "Зеркала", href: "/catalog?page=1&categories=Mirrors" },
    {
      name: "Душевые кабины",
      href: "/catalog?page=1&categories=Shower+cabins",
    },
  ],
  infoLinks: [
    { name: "Оплата", href: "#" },
    { name: "Доставка", href: "#" },
    { name: "Поставщикам", href: "#" },
    { name: "Статьи", href: "#" },
    { name: "Контакты", href: "#" },
  ],
  socialMediaLinks: [
    {
      name: "whatsapp",
      href: "https://www.whatsapp.com",
      img: "Footer/socialMedia/whatsapp.svg",
    },
    {
      name: "instagram",
      href: "https://www.instagram.com",
      img: "Footer/socialMedia/instagram.svg",
    },
    {
      name: "telegram",
      href: "https://www.telegram.org",
      img: "Footer/socialMedia/telegram.svg",
    },
  ],
  adress: "Москва, ул. Салтыковская, 6 стр 11",
  email: "zakaz@ggpromarket.ru",
  rate: {
    href: "#",
    imgUrl: "Footer/yandex.png",
    alt: "yandex",
  },
};

export default function FooterMain() {
  const number = headerData.callNumber;
  const [infoPopup, setInfoPopup] = useState({
    isOpen: false,
    message: "",
    cords: { X: 0, Y: 0 },
  });
  const infoMessage =
    "Данная функциональность на этом pet-проекте пока не реализована.";
  const hideTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (hideTimer.current) {
        window.clearTimeout(hideTimer.current);
      }
    };
  }, []);

  const showInfo = (event: AnchorTriggerEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();

    if (hideTimer.current) {
      window.clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }

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
    if (hideTimer.current) {
      window.clearTimeout(hideTimer.current);
    }

    hideTimer.current = window.setTimeout(() => {
      setInfoPopup((prev) =>
        prev.isOpen ? { ...prev, isOpen: false } : prev
      );
      hideTimer.current = null;
    }, 250);
  };
  return (
    <>
      <div className={Style.FooterMain}>
        <InfoDropdown
          cords={infoPopup.cords}
          message={infoPopup.message}
          isOpen={infoPopup.isOpen}
        />
        <Container>
          <div className={Style.FooterMain__wrapper}>
            <div className={Style.FooterMain__list}>
              <ul className={Style.FooterMain__ul}>
                {footerData.productLinks.map(
                  (link: { name: string; href: string }) => (
                    <li key={link.name} className={Style.FooterMain__item}>
                      <a href={link.href}>{link.name} </a>
                    </li>
                  )
                )}
              </ul>
              <Logo width={"214px"} height={"24px"} />
              <div className={Style.FooterMain__copyright}>© 2025 MadeX1X</div>
            </div>
            <div className={Style.FooterMain__list}>
              <ul className={Style.FooterMain__ul}>
                {footerData.infoLinks.map(
                  (link: { name: string; href: string }) => (
                    <li key={link.name} className={Style.FooterMain__li}>
                      <a
                        href={link.href}
                        onMouseEnter={link.href === "#" ? showInfo : undefined}
                        onMouseLeave={link.href === "#" ? hideInfo : undefined}
                        onFocus={link.href === "#" ? showInfo : undefined}
                        onBlur={link.href === "#" ? hideInfo : undefined}
                        onClick={
                          link.href === "#"
                            ? (event) => {
                                event.preventDefault();
                                showInfo(event);
                              }
                            : undefined
                        }
                      >
                        {link.name}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
            <div className={Style.FooterMain__contacts}>
              <>
                <PhoneNumber number={Number(number)} />
                <a
                  href={`tel:${number}`}
                  className={Style.FooterMain__callButton}
                >
                  Заказать звонок
                </a>{" "}
              </>
              <>
                <ul className={Style.FooterMain__workHours}>
                  <li className={Style.FooterMain__workHours__item}>
                    Пн-Пт: 10:00 — 20:00
                  </li>
                  <li className={Style.FooterMain__workHours__item}>
                    Сб: 10:00 — 18:00
                  </li>
                  <li className={Style.FooterMain__workHours__item}>
                    Вс: выходной
                  </li>
                </ul>
                <div className={Style.FooterMain__socialMedia}>
                  {footerData.socialMediaLinks.map(
                    (item: { name: string; href: string; img: string }) => {
                      return (
                        <a
                          key={item.name}
                          className={Style.FooterMain__socialMedia__item}
                          href={item.href}
                        >
                          <img src={item.img} />
                        </a>
                      );
                    }
                  )}
                </div>
              </>
            </div>
            <div className={Style.FooterMain__adress}>
              <>
                <p className={Style.FooterMain__adress__text}>Склад:</p>
                <p className={Style.FooterMain__adress}>{footerData.adress}</p>
                <a
                  href={`mailto:${footerData.email}`}
                  className={Style.FooterMain__email}
                >
                  {footerData.email}
                </a>
                <a
                  href={footerData.rate.href}
                  className={Style.FooterMain__rate}
                >
                  <img
                    className={Style.FooterMain__rate__img}
                    src={footerData.rate.imgUrl}
                    alt={footerData.rate.alt}
                  />
                </a>
              </>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
