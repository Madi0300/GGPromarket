import Style from "./Icons.module.scss";
import React from "react";
import type { IconItem } from "../../../api/types";

export default function Icons({
  content = [],
}: {
  content?: IconItem[];
}) {
  return (
    <div className={Style.Icons}>
      {content.map((item) => {
        return (
          <div className={Style.Icons__item} key={item.id}>
            <div className={Style.Icons__iconWrapper}>
              <img
                className={Style.Icons__iconWrapper__img}
                src={item.icon}
                alt={item.id}
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
