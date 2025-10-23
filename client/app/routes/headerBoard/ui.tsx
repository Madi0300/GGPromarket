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
          <img className={Style.Logo_img} src={`${import.meta.env.BASE_URL}headerBoard/logo.svg`} />
        </a>
      </div>
    </>
  );
}

export function Container({ children }: { children: ReactNode }) {
  return <div className={Style.Container}>{children}</div>;
}

type Item = { name: string; href: string };
type DropdownCoordinates = { X: number; Y: number };

type Props = {
  cords: DropdownCoordinates;
  items: Item[];
  isOpen: boolean;
  position?: "left" | "right";
  emptyPlaceholder?: ReactNode;
};

export const Dropdown = forwardRef<HTMLDivElement, Props>(function Dropdown(
  { cords, items, isOpen, position = "left", emptyPlaceholder },
  forwardedRef
) {
  const localRef = useRef<HTMLDivElement | null>(null);
  const [positionStyle, setPositionStyle] = useState<{
    top: number;
    left: number;
  }>({
    top: Math.max(0, cords.Y),
    left: Math.max(0, cords.X),
  });

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
  }, [forwardedRef, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const top = Math.max(0, cords.Y);
    const left = Math.max(0, cords.X);

    setPositionStyle((prev) => {
      if (prev.top === top && prev.left === left) {
        return prev;
      }
      return { top, left };
    });
  }, [cords.X, cords.Y, isOpen]);

  useEffect(() => {
    if (!isOpen || !localRef.current) return;

    const dropdownElement = localRef.current;
    const { width } = dropdownElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;

    const top = Math.max(0, cords.Y);
    let left = position === "left" ? cords.X - width : cords.X;

    if (left < 0) {
      left = 0;
    }

    if (left + width > viewportWidth) {
      left = Math.max(0, viewportWidth - width);
    }

    setPositionStyle((prev) => {
      if (prev.top === top && prev.left === left) {
        return prev;
      }
      return { top, left };
    });
  }, [isOpen, cords.X, cords.Y, position]);

  if (!isOpen) return null;

  return (
    <div
      ref={localRef}
      className={Style.Dropdown__list}
      style={{
        top: positionStyle.top,
        left: positionStyle.left,
      }}
    >
      {items.length > 0 ? (
        <ul className={Style.Dropdown__ul}>
          {items.map((item) => (
            <li key={item.name} className={Style.Dropdown__li}>
              <a href={item.href}>{item.name}</a>
            </li>
          ))}
        </ul>
      ) : (
        emptyPlaceholder ?? null
      )}
    </div>
  );
});

export function Call({ number = 84950183210 }: { number?: number }) {
  const stringedNumber = `${number}`;
  return (
    <>
      <div className={Style.Call}>
        <PhoneNumber number={number} />
        <img className={Style.Call__icon} src={`${import.meta.env.BASE_URL}header/showMore.svg`} alt="" />
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
        src={`${import.meta.env.BASE_URL}Goods/star.svg`}
        alt=""
        className={Style.Rate__icon}
      />
    );
  }
  if (curRate > 0) {
    stars.push(
      <img
        key={5 - curRate}
        src={`${import.meta.env.BASE_URL}Goods/halfStar.svg`}
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
          <img src={`${import.meta.env.BASE_URL}Goods/commentsIcon.svg`} alt="" />
          {rateSum}
        </span>
      </div>
    </>
  );
}
