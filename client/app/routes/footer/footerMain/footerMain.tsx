import Style from "./footerMain.module.scss";
import { Logo, PhoneNumber } from "../../headerBoard/ui";
import { Container } from "../../headerBoard/ui";
import type { FooterContent } from "../../../api/types";

type FooterMainProps = {
  content?: FooterContent;
  phone?: string;
  rawPhone?: string;
};

export default function FooterMain({
  content,
  phone,
  rawPhone,
}: FooterMainProps) {
  const productLinks = content?.productLinks ?? [];
  const infoLinks = content?.infoLinks ?? [];
  const socialMedia = content?.socialMedia ?? [];
  const schedule = content?.schedule ?? [];
  const rating = content?.rating;
  const email = content?.email ?? "zakaz@ggpromarket.ru";
  const address = content?.warehouseAddress ?? "Москва, ул. Салтыковская, 6 стр 11";
  const legal = content?.legal;

  const displayPhone = phone ?? "+7 (495) 018-32-10";
  const telNumber = rawPhone?.replace(/[^+\d]/g, "") ??
    displayPhone.replace(/[^+\d]/g, "");

  return (
    <div className={Style.FooterMain}>
      <Container>
        <div className={Style.FooterMain__wrapper}>
          <div className={Style.FooterMain__list}>
            <ul className={Style.FooterMain__ul}>
              {productLinks.map((link) => (
                <li key={link.id} className={Style.FooterMain__item}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
            <Logo width={"214px"} height={"24px"} />
            <div className={Style.FooterMain__copyright}>
              {legal?.company ?? "© 2020 ggpromarket.ru"}
            </div>
          </div>
          <div className={Style.FooterMain__list}>
            <ul className={Style.FooterMain__ul}>
              {infoLinks.map((link) => (
                <li key={link.id} className={Style.FooterMain__li}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className={Style.FooterMain__contacts}>
            <PhoneNumber number={displayPhone} />
            <a href={`tel:${telNumber}`} className={Style.FooterMain__callButton}>
              Заказать звонок
            </a>
            <ul className={Style.FooterMain__workHours}>
              {schedule.length > 0
                ? schedule.map((item) => (
                    <li
                      key={item}
                      className={Style.FooterMain__workHours__item}
                    >
                      {item}
                    </li>
                  ))
                : [
                    "Пн-Пт: 10:00 — 20:00",
                    "Сб: 10:00 — 18:00",
                    "Вс: выходной",
                  ].map((item) => (
                    <li
                      key={item}
                      className={Style.FooterMain__workHours__item}
                    >
                      {item}
                    </li>
                  ))}
            </ul>
            <div className={Style.FooterMain__socialMedia}>
              {socialMedia.map((item) => (
                <a
                  key={item.id}
                  className={Style.FooterMain__socialMedia__item}
                  href={item.href}
                >
                  <img src={item.icon} alt={item.label} />
                </a>
              ))}
            </div>
          </div>
          <div className={Style.FooterMain__adress}>
            <p className={Style.FooterMain__adress__text}>Склад:</p>
            <p className={Style.FooterMain__adress}>{address}</p>
            <a href={`mailto:${email}`} className={Style.FooterMain__email}>
              {email}
            </a>
            {rating ? (
              <a href={rating.href} className={Style.FooterMain__rate}>
                <img
                  className={Style.FooterMain__rate__img}
                  src={rating.image}
                  alt={rating.alt}
                />
              </a>
            ) : null}
          </div>
        </div>
      </Container>
    </div>
  );
}
