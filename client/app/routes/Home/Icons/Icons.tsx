import Style from "./Icons.module.scss";
import React from "react";

export type IconItem = { key: string; icon: string; text: string };

export const iconsData: readonly IconItem[] = [
  {
    key: "truck",
    icon: "Icons/truck.svg",
    text: "Быстрая доставка\nпо Москве и в любой\nрегион России",
  },
  {
    key: "shield",
    icon: "Icons/shield.svg",
    text: "Все товары имеют\nофициальную гарантию\nпроизводителя",
  },
  {
    key: "forklift",
    icon: "Icons/forklift.svg",
    text: "Более 100 000 товаров",
  },
  { key: "coin", icon: "Icons/coin.svg", text: "Любой способ оплаты" },
  { key: "like", icon: "Icons/like.svg", text: "Высокие оценки клиентов" },
] as const;

export default function Icons({
  content = iconsData,
}: {
  content?: readonly IconItem[];
}) {
  return (
    <div className={Style.Icons}>
      {content.map((item) => {
        return (
          <div className={Style.Icons__item} key={item.key}>
            <div className={Style.Icons__iconWrapper}>
              <img
                className={Style.Icons__iconWrapper__img}
                src={import.meta.env.BASE_URL + item.icon}
                alt={item.key}
              />
            </div>
            <p className={Style.Icons__content}>
              {item.text.split("\n").map((item, index) => {
                return (
                  <React.Fragment key={index}>
                    {item}
                    <br />
                  </React.Fragment>
                );
              })}
            </p>
          </div>
        );
      })}
    </div>
  );
}
