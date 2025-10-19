import Style from "./footerMain.module.scss";
import { Logo, PhoneNumber } from "../../headerBoard/ui";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { Container } from "../../headerBoard/ui";
import { useGetHeaderDataQuery } from "../../../store/apiSlise";
import { useGetFooterDataQuery } from "#/apiSlise";

const footerContentOffline = {
  productLinks: [
    { name: "Error", href: "#" },
    { name: "Мебель для ванной", href: "#" },
    { name: "Электроника и бытовая техника", href: "#" },
    { name: "Отопление", href: "#" },
    { name: "Напольное покрытие", href: "#" },
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
    imgUrl: "/Footer/rate/yandex.png",
    alt: "yandex",
  },
} as const;

export default function FooterMain() {
  const { data: headerData, isSuccess: isHeaderSuccess } =
    useGetHeaderDataQuery(null);
  const { data: footerData, isSuccess: isFooterSuccess } =
    useGetFooterDataQuery(null);

  const number = isHeaderSuccess ? headerData.callNumber : "";
  const footerContent = isFooterSuccess ? footerData : footerContentOffline;
  return (
    <>
      <div className={Style.FooterMain}>
        <Container>
          <div className={Style.FooterMain__wrapper}>
            <div className={Style.FooterMain__list}>
              <ul className={Style.FooterMain__ul}>
                {footerContent.productLinks.map(
                  (link: { name: string; href: string }) => (
                    <li key={link.name} className={Style.FooterMain__item}>
                      <a href={link.href}>{link.name} </a>
                    </li>
                  )
                )}
              </ul>
              <Logo width={"214px"} height={"24px"} />
              <div className={Style.FooterMain__copyright}>
                © 2020 ggpromarket.ru
              </div>
            </div>
            <div className={Style.FooterMain__list}>
              <ul className={Style.FooterMain__ul}>
                {footerContent.infoLinks.map(
                  (link: { name: string; href: string }) => (
                    <li key={link.name} className={Style.FooterMain__li}>
                      <a href={link.href}>{link.name}</a>
                    </li>
                  )
                )}
              </ul>
            </div>
            <div className={Style.FooterMain__contacts}>
              <PhoneNumber number={Number(number)} />
              <a
                href={`tel:${number}`}
                className={Style.FooterMain__callButton}
              >
                Заказать звонок
              </a>
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
                {footerContentOffline.socialMediaLinks.map(
                  (item: { name: string; href: string; img: string }) => {
                    return (
                      <a
                        key={item.name}
                        className={Style.FooterMain__socialMedia__item}
                        href={item.href}
                      >
                        <img src={import.meta.env.BASE_URL + item.img} />
                      </a>
                    );
                  }
                )}
              </div>
            </div>
            <div className={Style.FooterMain__adress}>
              <p className={Style.FooterMain__adress__text}>Склад:</p>
              <p className={Style.FooterMain__adress}>{footerContent.adress}</p>
              <a
                href={`mailto:${footerContent.email}`}
                className={Style.FooterMain__email}
              >
                {footerContent.email}
              </a>
              <a
                href={footerContent.rate.href}
                className={Style.FooterMain__rate}
              >
                <img
                  className={Style.FooterMain__rate__img}
                  src={footerContent.rate.imgUrl}
                  alt={footerContent.rate.alt}
                />
              </a>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
