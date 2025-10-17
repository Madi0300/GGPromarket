import Style from "./ui.module.scss";
import type { ReactNode } from "react";
import { useState, useRef, useEffect, forwardRef } from "react";

export function Logo({
  width = "296px",
  height = "33.21px",
}: {
  width?: string;
  height?: string;
}) {
  return (
    <>
      <div className={Style.Logo} style={{ width: width, height: height }}>
        <a href="/">
          <img className={Style.Logo_img} src="/headerBoard/logo.svg" />
        </a>
      </div>
    </>
  );
}

export function Container({ children }: { children: ReactNode }) {
  return <div className={Style.Container}>{children}</div>;
}

type Item = { name: string; href: string };

type Props = {
  toggleKey: number;
  items: Item[];
  position?: "left" | "right";
};

export const Dropdown = forwardRef<HTMLDivElement, Props>(function Dropdown(
  { toggleKey, items, position = "left" },
  forwardedRef
) {
  const localRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!forwardedRef) return;

    if (typeof forwardedRef === "function") {
      forwardedRef(localRef.current);
    } else {
      (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current =
        localRef.current;
    }

    return () => {
      if (!forwardedRef) return;
      if (typeof forwardedRef === "function") {
        forwardedRef(null);
      } else {
        (
          forwardedRef as React.MutableRefObject<HTMLDivElement | null>
        ).current = null;
      }
    };
  }, [forwardedRef]);

  useEffect(() => {
    let timer: number | undefined;

    if (!isOpen && toggleKey > 0) {
      timer = window.setTimeout(() => {
        setIsOpen(true);
      }, 0);
    } else {
      if (localRef.current) {
        localRef.current.classList.remove(Style.Dropdown__list__active);
      }
      timer = window.setTimeout(() => {
        if (!localRef.current) return;
        localRef.current.classList.remove(Style.Dropdown__list__active);
        setIsOpen(false);
      }, 300);
    }

    return () => {
      if (timer !== undefined) clearTimeout(timer);
    };
  }, [toggleKey]);

  useEffect(() => {
    if (isOpen && localRef.current) {
      localRef.current.classList.add(Style.Dropdown__list__active);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={localRef}
      className={
        Style.Dropdown__list + " " + Style["Dropdown__list__" + position]
      }
    >
      <ul className={Style.Dropdown__ul}>
        {items.map((item) => (
          <li key={item.name} className={Style.Dropdown__li}>
            <a href={item.href}>{item.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
});

export function Call({ number = 84950183210 }: { number?: number }) {
  const stringedNumber = `${number}`;
  return (
    <>
      <div className={Style.Call}>
        <PhoneNumber number={number} />
        <img className={Style.Call__icon} src="/header/showMore.svg" alt="" />
        <a
          className={`${Style.Call__link} ${Style.underlined}`}
          href={"tel:" + stringedNumber}
        >
          Заказать звонок
        </a>
      </div>
    </>
  );
}

export function PhoneNumber({ number }: { number: number }) {
  const stringedNumber = `${number}`;
  const formattedPhone: string = `${stringedNumber[0]} ${stringedNumber.slice(1, 4)} ${stringedNumber.slice(4, 7)}-${stringedNumber.slice(7, 9)}-${stringedNumber.slice(9)}`;

  return (
    <>
      <span className={Style.Call__number}>{formattedPhone}</span>
    </>
  );
}

type RateProps = {
  rateSum: number;
  commentsSum: number;
};

export function Rate({ rateSum, commentsSum }: RateProps) {
  let curRate = rateSum;
  const stars: ReactNode[] = [];

  if (rateSum < 0) {
    return null;
  }
  for (let i = 1; i <= curRate; curRate--) {
    stars.push(
      <img
        key={5 - curRate}
        src="/Goods/star.svg"
        alt=""
        className={Style.Rate__icon}
      />
    );
  }
  if (curRate > 0) {
    stars.push(
      <img
        key={5 - curRate}
        src="/Goods/halfStar.svg"
        alt=""
        className={Style.Rate__icon}
      />
    );
  }

  return (
    <>
      <div className={Style.Rate}>
        <span className={Style.Rate__stars}>{stars}</span>
        <span className={Style.Rate__comments}>
          <img src="/Goods/commentsIcon.svg" alt="" />
          {rateSum}
        </span>
      </div>
    </>
  );
}
